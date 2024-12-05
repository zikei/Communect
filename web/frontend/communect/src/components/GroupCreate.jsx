import React, { useState } from "react";
import "../css/groupCreate.css";

function GroupCreate({ onSubmit, availableGroups = [], availableUsers = [] }) {
  const [groupName, setGroupName] = useState("");
  const [aboveId, setAboveId] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      setError("グループ名は必須です。");
      return;
    }

    const newGroup = {
      name: groupName.trim(),
      above: aboveId || null,
      users: selectedUsers,
    };

    onSubmit(newGroup);
    closeModal(); // モーダルを閉じる
    setGroupName(""); // フォームのリセット
    setAboveId("");
    setSelectedUsers([]);
    setError(null);
  };

  const handleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="container">
      <h2>グループ作成</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="form-group">
        <label className="form-label mt-3">
          グループ名:
          <input
            type="text"
            className="form-control"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="グループ名を入力"
            required
          />
        </label>
        <label className="form-label mt-3">
          親グループ:
          <select
            className="form-select"
            value={aboveId}
            onChange={(e) => setAboveId(e.target.value)}
          >
            <option value="">なし</option>
            {availableGroups.map((group) => (
              <option key={group.groupId} value={group.groupId}>
                {group.groupName}
              </option>
            ))}
          </select>
        </label>
        <label className="form-label mt-3">
          ユーザーを選択:
          <div className="form-check">
            {availableUsers.map((user) => (
              <div key={user.userId}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={user.userId}
                  value={user.userId}
                  onChange={() => handleUserSelection(user.userId)}
                  checked={selectedUsers.includes(user.userId)}
                />
                <label className="form-check-label" htmlFor={user.userId}>
                  {user.nickName} ({user.userName})
                </label>
              </div>
            ))}
          </div>
        </label>
        <button type="submit" className="btn btn-primary mt-3">
          グループ作成
        </button>
      </form>
    </div>
  );
}

export default GroupCreate;
