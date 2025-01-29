import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import EditGroupModal from "./components/group/feature/EditGroupModal";
import GroupMemberModal from "./components/group/feature/GroupMemberModal";
import Breadcrumb from "./components/group/Breadcrumb";
import GroupCreate from "./components/GroupCreate";
import GroupTalk from "./components/GroupTalk";
import GroupContact from "./components/GroupContact";
import "./css/main.css";
import axios from "axios";

function Group() {
  const [groups, setGroups] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [currentGroup, setCurrentGroup] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [error, setError] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModalGroup, setEditModalGroup] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [isGroupTalk, setIsGroupTalk] = useState(false); 
  const [talkGroup, setTalkGroup] = useState(null);

  const buildHierarchy = (groups) => {
    const groupMap = new Map();
    const roots = [];

    groups.forEach((group) => {
      groupMap.set(group.groupId, { ...group, children: [] });
    });

    groups.forEach((group) => {
      if (group.aboveId) {
        groupMap.get(group.aboveId)?.children.push(groupMap.get(group.groupId));
      } else {
        roots.push(groupMap.get(group.groupId));
      }
    });

    return roots;
  };

  const findGroupById = (groupId, groups) => {
    for (const group of groups) {
      if (group.groupId === groupId) return group;
      if (group.children.length > 0) {
        const found = findGroupById(groupId, group.children);
        if (found) return found;
      }
    }
    return null;
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups((prevState) => ({
      ...prevState,
      [groupId]: !prevState[groupId],
    }));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleFormSubmit = (formData) => {
    setPosts((prevPosts) => [...prevPosts, formData]);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/group",
          {credentials: "include",
           withCredentials: true
          }
        );
        const hierarchy = buildHierarchy(response.data.groups);
        setGroups(hierarchy);
      } catch (err) {
        console.error("Error fetching groups:", err);
        setError("Failed to load groups. Please try again later.");
      }
    };

    fetchGroups();
  }, []);

  const handleGroupClick = (group) => {
    setCurrentGroup(group);
    setBreadcrumb((prev) => {
      const trail = [];
      let current = group;
      while (current) {
        trail.unshift(current);
        current = groups.find((g) => g.groupId === current.aboveId);
      }
      return trail;
    });

    setExpandedGroups((prevState) => ({
      ...prevState,
      [group.groupId]: true,
    }));
  };

  /* 作成関連 */
  const handleAddGroup = (newGroup) => {
    setGroups((prevGroups) => {
      const updatedGroups = [...prevGroups, newGroup]; 
      return buildHierarchy(updatedGroups);
    });
  };  

  /* 編集関連 */
  const handleEditGroup = (group) => {
    setEditModalGroup(group);
  };

  const handleCloseEditModal = () => {
    setEditModalGroup(null); 
  };

  const handleUpdateGroup = (groupId, newName) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.groupId === groupId ? { ...group, groupName: newName } : group
      )
    );
  
    if (currentGroup && currentGroup.groupId === groupId) {
      setCurrentGroup((prev) => ({ ...prev, groupName: newName }));
    }
  
    setBreadcrumb((prevBreadcrumb) =>
      prevBreadcrumb.map((group) =>
        group.groupId === groupId ? { ...group, groupName: newName } : group
      )
    );
  };

  // 削除関連
  const handleDeleteGroup = (deletedGroupId) => {
    setGroups((prevGroups) => {
      const filterGroups = (groups) =>
        groups
          .filter((group) => group.groupId !== deletedGroupId)
          .map((group) => ({
            ...group,
            children: filterGroups(group.children),
          }));
  
      return filterGroups(prevGroups);
    });
  
    if (currentGroup && currentGroup.groupId === deletedGroupId) {
      setCurrentGroup(null);
      setBreadcrumb([]);
    }
  };

  /* メンバー関連 */
  const handleShowMembers = (groupId) => {
    setSelectedGroupId(groupId);
    setShowMembersModal(true);
  };

  const handleCloseMembersModal = () => {
    setShowMembersModal(false);
    setSelectedGroupId(null);
  };

  /* トーク関連 */
  const handleOpenTalk = (group) => {
    setTalkGroup(group);
    setIsGroupTalk(true);
  };

  const handleBackFromTalk = () => {
    setIsGroupTalk(false);
    setTalkGroup(null);
  };

  return (
    <div className="container-fluid vh-100 overflow-hidden p-0">
      <header className="h-20 navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <img src="./logo.png" alt="logo" width={200} className="me-3" />
          </div>
        </div>
      </header>
      <main className="h-80 d-flex">
        <Sidebar
          groups={groups}
          expandedGroups={expandedGroups}
          toggleGroup={toggleGroup}
          handleGroupClick={handleGroupClick}
          sidebarWidth={sidebarWidth}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          toggleModal={toggleModal}
          error={error}
          currentGroup={currentGroup}
          handleDeleteGroup={handleDeleteGroup}
          onEditGroup={handleEditGroup}
          onShowMembers={handleShowMembers}
          onOpenTalk={handleOpenTalk}
        />
        <div className="maincontent flex-grow-1 ps-5 reset">
          {isGroupTalk && talkGroup ? (
            <GroupTalk group={talkGroup} onBack={handleBackFromTalk} currentGroup={currentGroup} />
          ) : (
            <>
              <Breadcrumb
                breadcrumb={breadcrumb}
                handleGroupClick={handleGroupClick}
              />
              {currentGroup ? (
                <div className="card">
                  <GroupContact
                    groupName={currentGroup.groupName}
                    hasPermission={true}
                    onFormSubmit={handleFormSubmit}
                    groupId={currentGroup.groupId}
                    posts={posts}
                  />
                </div>
              ) : (
                <p>グループが選択されていません。グループを選択してください。<br/>グループが無い場合は、グループ作成を行ってください。</p>
              )}
            </>
          )}
        </div>
      </main>
      {showModal && (
        <div className="modal-overlay">
          <GroupCreate
            onSubmit={handleAddGroup}
            currentGroup={currentGroup}
            toggleModal={toggleModal}
          />
        </div>
      )}

      {editModalGroup && (
            <EditGroupModal
              group={editModalGroup}
              onClose={handleCloseEditModal}
              onUpdateGroup={handleUpdateGroup}
            />
      )}

      {showMembersModal && selectedGroupId && (
        <GroupMemberModal
          groupId={selectedGroupId}
          show={showMembersModal}
          onClose={handleCloseMembersModal}
        />
      )}
    </div>
  );
}

export default Group;