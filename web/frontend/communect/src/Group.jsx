import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Breadcrumb from "./components/group/Breadcrumb";
import GroupCreate from "./components/GroupCreate";
import GroupContact from "./components/GroupContact";
import "./css/group.css";
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
        current = findGroupById(current.aboveId, groups);
      }
      return trail;
    });

    // 必要ならば選択グループを開く
    setExpandedGroups((prevState) => ({
      ...prevState,
      [group.groupId]: true,
    }));
  };

  const handleGroupDelete = async (deletedGroupId) => {
    try {
      // API呼び出しでグループ削除
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/group/${deletedGroupId}`
      );

      // フロントエンド状態を更新
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
        />
        <div className="maincontent flex-grow-1 pt-2 px-5 reset">
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
    </div>
  );
}

export default Group;
