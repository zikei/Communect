import React, { useState, useEffect } from "react";
import "./css/group.css";

function Group() {
  const [groups, setGroups] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [currentGroup, setCurrentGroup] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [error, setError] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    <li
      key={group.groupId}
      className="list-group-item"
    >
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
      <header className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <img src="./logo.png" alt="logo" width={200} className="me-3" />
            <h1 className="text-white fs-4">~Communect~</h1>
          </div>
        </div>
      </header>
      <main className="d-flex vh-100">
        <aside
          className="bg-light p-3 border-end"
          style={{
            width: `${sidebarWidth}px`,
            whiteSpace: "nowrap",
            display: sidebarOpen ? "block" : "none",
          }}
        >
          <nav className="nav flex-column">
            <a href="/" className="nav-link">
              Home
            </a>
            <a href="/personal-chat" className="nav-link">
              Personal Chat
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
        <div className="flex-grow-1 p-4 border-start">
          {breadcrumb.length > 0 && (
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
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
              <div className="card-body">
                <h5 className="card-title">{currentGroup.groupName}</h5>
                <a className="btn btn-primary mt-4" href={`/group/${currentGroup.groupId}`}>詳細</a>
              </div>
            </div>
          ) : (
            <p>Select a group to see details.</p>
          )}
        </div>
        {/* サイドバー開閉アイコン */}
        <div
          className="sidebar-toggle-icon"
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            bottom: "20px",
            left: "20px",
            width: "50px", // 幅を設定
            height: "50px", // 高さを設定
            padding: "20px", // アイコンに余白を追加
            cursor: "pointer",
            fontSize: "24px",
            backgroundColor: "#007bff", // 背景色
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            lineHeight: "30px",
          }}
        >
          {/* Bootstrap Icons */}
          <i
            className={`bi ${sidebarOpen ? "bi-arrow-bar-left" : "bi-list"}`}
          ></i>
        </div>
      </main>
    </div>
  );
}

export default Group;
