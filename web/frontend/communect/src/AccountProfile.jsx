import React, { useState } from "react";
import UserProfile from "./components/UserProfile";
import Logout from "./Logout";
import "./css/sidebar.css";
import "./css/main.css";

function AccountProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(300);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
        <aside
          className="bg-light p-3 border-end"
          style={{
            width: `${sidebarWidth}px`,
            whiteSpace: "nowrap",
            display: sidebarOpen ? "block" : "none",
          }}
        >
          <nav className="nav flex-column">
            <a href="/dm" className="nav-link">Direct Messages</a>
            <a href="/group" className="nav-link">Groups</a>
            <h5 className="mt-3">Account</h5>
          </nav>
          <Logout />
        </aside>

        <div
          className="resizer"
          onMouseDown={(e) => {
            e.preventDefault();
            document.addEventListener("mousemove", (e) => setSidebarWidth((prev) => prev + e.movementX));
            document.addEventListener("mouseup", () => document.removeEventListener("mousemove", () => {}));
          }}
        ></div>

        <div className="maincontent flex-grow-1 ps-5 reset">
          <UserProfile />
        </div>
      </main>

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
        <i className={`bi ${sidebarOpen ? "bi-arrow-bar-left" : "bi-list"}`}></i>
      </div>
    </div>
  );
}

export default AccountProfile;