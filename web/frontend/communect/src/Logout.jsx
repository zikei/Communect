import React from "react";
import "./css/sidebar.css"; // 確実にCSSを読み込む

function Logout() {
  const handleLogout = async () => {
    try {
      const response = await fetch("/logout", {
        method: "GET",
        credentials: "include", // Cookieを送信するために必要
      });

      if (response.ok) {
        console.log("Logged out successfully");
        window.location.href = "/login";
      } else {
        console.error(`Failed to log out: ${response.status}`);
        alert("ログアウトに失敗しました。");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("ログアウト中にエラーが発生しました。");
    }
  };

  return (
    <div className="logout-section">
      <button className="btn btn-danger w-100" onClick={handleLogout}>
        ログアウト
      </button>
    </div>
  );
}

export default Logout;
