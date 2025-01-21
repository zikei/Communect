import React from "react";
import Logout from "../Logout";
import GroupTree from "./group/GroupTree";
import "../css/sidebar.css";

function Sidebar({
  groups,
  expandedGroups,
  toggleGroup,
  handleGroupClick,
  sidebarWidth,
  sidebarOpen,
  toggleSidebar,
  toggleModal,
  error,
  currentGroup,
  handleGroupDelete,
  onEditGroup,
  onShowMembers,
  onOpenTalk,
}) {

  return (
    <>
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
                {groups.map((group) => (
                  <GroupTree
                    key={group.groupId}
                    group={group}
                    expandedGroups={expandedGroups}
                    toggleGroup={toggleGroup}
                    handleGroupClick={handleGroupClick}
                    currentGroup={currentGroup}
                    onDeleteGroup={handleGroupDelete}
                    onEditGroup={onEditGroup}
                    onShowMembers={onShowMembers}
                    onOpenTalk={onOpenTalk}
                  />
                ))}
              </ul>
            ) : (
              <div>{error || "Loading..."}</div>
            )}
          </div>
          <a href="/account" className="nav-link">
          Account
          </a>
        </nav>
        <div><Logout /></div>
      </aside>
      <div
        className="resizer"
        onMouseDown={(e) => {
          e.preventDefault();
          document.addEventListener("mousemove", (e) =>
            toggleSidebar(e.movementX)
          );
          document.addEventListener("mouseup", () =>
            document.removeEventListener("mousemove", toggleSidebar)
          );
        }}
      ></div>
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
    </>
  );
}

export default Sidebar;
