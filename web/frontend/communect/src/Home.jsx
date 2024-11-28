import React, { useEffect } from "react";
import "./css/home.css";

function Home() {
  useEffect(() => {
    new Granim({
      element: "#canvas-basic",
      direction: "diagonal",
      states: {
        "default-state": {
          gradients: [
            ["#ff9966", "#ff5e62"],
            ["#00F260", "#0575E6"],
            ["#e1eec3", "#f05053"],
          ],
          transitionSpeed: 2000,
        },
      },
    });
  }, []);

  return (
    <div className="container-fluid vh-100 overflow-hidden px-0">
      {/* 背景用のCanvas */}
      <canvas
        id="canvas-basic"
        className="position-fixed top-0 start-0 w-100 h-100"
      ></canvas>

      {/* ヘッダー */}
      <header className="navbar navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <img src="./logo.png" alt="logo" width={200} className="me-3" />
            <h1 className="text-white fs-4">~Communect~</h1>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="d-flex vh-100">
        {/* サイドバー */}
        <aside
          className="bg-light border-end p-3 flex-shrink-0"
          style={{ width: "250px", marginLeft: "0" }}
        >
          <nav className="nav flex-column">
            <a href="#" className="nav-link active">Home</a>
            <a href="#" className="nav-link">Personal Chat</a>
            <a href="/group" className="nav-link">Groups</a>
            <a href="#" className="nav-link">Settings</a>
          </nav>
        </aside>

        {/* メインエリア */}
        <div className="flex-grow-1 p-4">
          <p className="p-design">ここから始めましょう！！</p>
        </div>
      </main>
    </div>
  );
}

export default Home;
