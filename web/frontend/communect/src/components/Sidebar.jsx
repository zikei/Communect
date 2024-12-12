import React from "react";

function Sidebar({
  groups,
  expandedGroups,
  toggleGroup,
  handleGroupClick,
  renderGroupTree,
  sidebarWidth,
  sidebarOpen,
  toggleSidebar,
  toggleModal,
  error,
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