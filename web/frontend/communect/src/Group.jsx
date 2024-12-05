import React, { useState, useEffect } from "react";
import GroupCreate from "./components/GroupCreate";
import GroupTalk from "./components/GroupTalk";
import "./css/group.css";

function Group() {
  const [groups, setGroups] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [currentGroup, setCurrentGroup] = useState(null);
  const [groupMessages, setGroupMessages] = useState({
    1: [
      {
        id: 1,
        user: "プロデューサー",
        text: "こんにちは！",
        timestamp: "2024-12-02 10:00",
      },
      {
        id: 3,
        user: "testA",
        text: "こんにちはー",
        timestamp: "2024-12-02 10:01",
      },
      { id: 4, user: "testB", text: "ども", timestamp: "2024-12-02 10:03" },
      { id: 5, user: "testC", text: "おす", timestamp: "2024-12-02 10:03" },
      { id: 6, user: "testD", text: "うい", timestamp: "2024-12-02 10:05" },
    ],
    2: [
      {
        id: 2,
        user: "佐藤花子",
        text: "専門大学の話題",
        timestamp: "2024-12-02 10:05",
      },
    ],
    // 他のグループのデータもここに追加
  });
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [error, setError] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false); // モーダル表示管理

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

  const handleSendMessage = (groupId, newMessage) => {
    setGroupMessages((prev) => ({
      ...prev,
      [groupId]: [...(prev[groupId] || []), newMessage],
    }));
  };

  const handleResize = (e) => {
    setSidebarWidth((prevWidth) => Math.max(200, prevWidth + e.movementX));
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
            <h1 className="text-white fs-4">~Communect~</h1>
          </div>
        </div>
      </header>
      <main className="h-80 d-flex">
        <aside
          className="bg-light p-3 border-end"
          style={{
            width: `${sidebarWidth}px`,
            whiteSpace: "nowrap",
            display: sidebarOpen ? "block" : "none",
          }}
        >
          <nav className="nav flex-column">
            <button className="btn btn-primary mb-3" onClick={toggleModal}>
              グループ作成
            </button>
            <a href="/dm" className="nav-link">
              Direct Message
            </a>
            <div>
              <h5 className="mt-3">Groups</h5>
              {groups.length > 0 ? (
                <ul className="list-group">
                  {groups.map((group) => renderGroupTree(group))}
                </ul>
              ) : (
                <div>{error || "Loading..."}</div>
              )}
            </div>
            <a href="/settings" className="nav-link">
              Settings
            </a>
          </nav>
        </aside>
        <div
          className="resizer"
          onMouseDown={(e) => {
            e.preventDefault();
            document.addEventListener("mousemove", handleResize);
            document.addEventListener("mouseup", () =>
              document.removeEventListener("mousemove", handleResize)
            );
          }}
        ></div>
        <div className="flex-grow-1 pt-2 border-start">
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
              <GroupTalk
                group={currentGroup}
                messages={groupMessages[currentGroup.groupId] || []}
                onSendMessage={handleSendMessage}
              />
            </div>
          ) : (
            <p>Select a group to see details.</p>
          )}
        </div>
        <div
          className="sidebar-toggle-icon"
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            bottom: "20px",
            left: "20px",
            width: "50px",
            height: "50px",
            padding: "20px",
            cursor: "pointer",
            fontSize: "24px",
            backgroundColor: "#007bff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <i
            className={`bi ${sidebarOpen ? "bi-arrow-bar-left" : "bi-list"}`}
          ></i>
        </div>
      </main>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="btn-close" onClick={toggleModal}></button>
            <GroupCreate
              onSubmit={(newGroup) => {
                // 新しいグループの処理をここに追加
                console.log(newGroup);
                toggleModal(); // モーダルを閉じる
              }}
              availableGroups={[
                { groupId: "1", groupName: "初星学園" },
                { groupId: "2", groupName: "専門大学" },
              ]} // ダミーデータ
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
