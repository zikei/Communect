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
    // Fetch groups from the API
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/group"
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

  /* 削除機能 */
  const handleGroupDelete = async (deletedGroupId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/group/${deletedGroupId}`
      );

      // フロントエンド状態更新
      const removeGroupFromHierarchy = (groups, groupIdToDelete) => {
        return groups
          .map((group) => {
            if (group.children.length > 0) {
              group.children = removeGroupFromHierarchy(
                group.children,
                groupIdToDelete
              );
            }
            return group.groupId === groupIdToDelete ? null : group;
          })
          .filter((group) => group !== null);
      };
      const updatedGroups = removeGroupFromHierarchy(groups, deletedGroupId);
      setGroups(updatedGroups);
      // 現在選択されているグループが削除された場合、選択をリセット
      if (currentGroup && currentGroup.groupId === deletedGroupId) {
        setCurrentGroup(null);
      }

      // パンくずリストを更新（削除したグループが含まれている場合にリセット）
      setBreadcrumb((prevBreadcrumb) =>
        prevBreadcrumb.filter((b) => b.groupId !== deletedGroupId)
      );

      // 展開状態も削除されたグループに関連する部分をリセット
      setExpandedGroups((prevExpandedGroups) => {
        const updatedExpanded = { ...prevExpandedGroups };
        delete updatedExpanded[deletedGroupId];
        return updatedExpanded;
      });
    } catch (err) {
      console.error("Error deleting group:", err);
    }
  };

  /* 編集関連 */
  const handleEditGroup = (group) => {
    setEditModalGroup(group); // 編集するグループをセット
  };

  const handleCloseEditModal = () => {
    setEditModalGroup(null); // モーダルを閉じる
  };

  const handleUpdateGroup = (groupId, updatedData) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.groupId === groupId ? { ...group, ...updatedData } : group
      )
    );
  };

  /* メンバー表示機能 */
  const handleShowMembers = (groupId) => {
    setSelectedGroupId(groupId);
    setShowMembersModal(true);
  };

  const handleCloseMembersModal = () => {
    setShowMembersModal(false);
    setSelectedGroupId(null);
  };

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
          handleGroupDelete={handleGroupDelete}
          onEditGroup={handleEditGroup}
          onShowMembers={handleShowMembers}
          onOpenTalk={handleOpenTalk} // 新しいプロパティを渡す
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
                <p>Select a group to see details.</p>
              )}
            </>
          )}
        </div>
      </main>
      {showModal && (
        <div className="modal-overlay">
          <GroupCreate
            onSubmit={handleFormSubmit}
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