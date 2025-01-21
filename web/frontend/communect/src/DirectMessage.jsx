import React, { useState } from "react";
import "./css/sidebar.css";
import "./css/main.css";
import DirectMessageTalk from "./components/DirectMessageTalk";

function DirectMessage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [sidebarWidth, setSidebarWidth] = useState(300);
    const [showModal, setShowModal] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleModal = () => {
        setShowModal(!showModal);
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
                      <button className="btn btn-primary mb-3" onClick={toggleModal}>
                        グループ作成
                      </button>
                      <h5  className="mt-3">
                        Direct Message
                      </h5>
                      <a href="/group" className ="nav-link">Groups</a>
                      <a href="/account" className="nav-link">Account</a>
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
            <div className="maincontent flex-grow-1 ps-5 reset">
              <DirectMessageTalk />
            </div>
          </main>
        </div>
    );
}

export default DirectMessage;
