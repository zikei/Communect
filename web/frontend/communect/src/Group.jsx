import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import GroupCreate from "./components/GroupCreate";
import GroupContact from "./components/GroupContact";
import "./css/group.css";

function Group() {
  const [groups, setGroups] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [currentGroup, setCurrentGroup] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [error, setError] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [posts, setPosts] = useState([
    {
      message: "12月のスケジュールについて",
      contactType: "INFORM",
      importance: "LOW",
      choices: [],
    },
    {
      message: "急遽、教室の変更がありました。明日の２限目は５０２教室です。",
      contactType: "CONFIRM",
      importance: "MEDIUM",
      choices: [],
    },
    {
      message: "卒業研究の日程決め",
      contactType: "CHOICE",
      importance: "HIGH",
      choices: ["12/20", "1/10", "2/20"],
    },
  ]);
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

  const handleResize = (e) => {
    setSidebarWidth((prevWidth) => Math.max(200, prevWidth + e.movementX));
  };

  const handleFormSubmit = (formData) => {
    setPosts((prevPosts) => [...prevPosts, formData]);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    const mockResponse = {
      groups: [
        { groupId: "1", groupName: "初星学園", aboveId: null },
        { groupId: "2", groupName: "専門大学", aboveId: "1" },
        { groupId: "3", groupName: "プロデューサー科", aboveId: "2" },
        { groupId: "4", groupName: "電子開発学園", aboveId: null },
        { groupId: "5", groupName: "KCS", aboveId: "4" },
        { groupId: "6", groupName: "KCSK", aboveId: "5" },
        { groupId: "7", groupName: "大学併修科", aboveId: "6" },
        { groupId: "8", groupName: "R4A1", aboveId: "7" },
        { groupId: "9", groupName: "国試対策", aboveId: "6" },
        { groupId: "10", groupName: "高度対策クラス", aboveId: "9" },
      ],
    };

    try {
      const hierarchy = buildHierarchy(mockResponse.groups);
      setGroups(hierarchy);
    } catch (err) {
      console.error("Error processing groups:", err);
      setError("Failed to load groups. Please try again later.");
    }
  }, []);

  const handleGroupClick = (group) => {
    setCurrentGroup(group);
    const trail = [];
    let current = group;
    while (current) {
      trail.unshift(current);
      current = findGroupById(current.aboveId, groups);
    }
    setBreadcrumb(trail);
  };

  const renderGroupTree = (group, level = 0) => (
    <li key={group.groupId} className="list-group-item">
      <div className="d-flex align-items-center">
        <button
          className="btn btn-link text-decoration-none w-100 text-start text-truncate"
          onClick={() => handleGroupClick(group)}
        >
          {group.groupName}
        </button>
        {group.children.length > 0 && (
          <button
            className="btn btn-sm group-toggle-btn"
            onClick={() => toggleGroup(group.groupId)}
          >
            <span
              className={`rotate-icon ${
                expandedGroups[group.groupId] ? "rotated" : ""
              }`}
            >
              &gt;
            </span>
          </button>
        )}
      </div>
      {group.children.length > 0 && expandedGroups[group.groupId] && (
        <ul className="list-unstyled">
          {group.children.map((child) => renderGroupTree(child, level + 1))}
        </ul>
      )}
    </li>
  );

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
          renderGroupTree={renderGroupTree}
          sidebarWidth={sidebarWidth}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          toggleModal={toggleModal}
          error={error}
        />
        <div className="maincontent flex-grow-1 pt-2 px-5 reset">
          {breadcrumb.length > 0 && (
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb m-0 mx-3 my-2">
                {breadcrumb.map((item, index) => (
                  <li key={item.groupId} className="breadcrumb-item">
                    {index === breadcrumb.length - 1 ? (
                      <span>{item.groupName}</span>
                    ) : (
                      <a href="#" onClick={() => handleGroupClick(item)}>
                        {item.groupName}
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
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
          <div className="modal-content">
            <button className="btn-close" onClick={toggleModal}></button>
            <GroupCreate
              onSubmit={(newGroup) => {
                console.log(newGroup);
                toggleModal();
              }}
              availableGroups={[
                { groupId: "1", groupName: "初星学園" },
                { groupId: "2", groupName: "専門大学" },
              ]}
              availableUsers={[
                { userId: "1", nickName: "田中太郎", userName: "tanaka" },
                { userId: "2", nickName: "佐藤花子", userName: "sato" },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Group;