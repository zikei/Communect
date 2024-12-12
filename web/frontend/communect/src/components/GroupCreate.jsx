import React, { useState } from "react";
import "../css/groupCreate.css";

function GroupCreate({ onSubmit }) {
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
    setGroupName(""); // Reset form
    setAboveId("");
    setSelectedUsers([]);
    setError(null);
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
          親グループID:
          <input
            type="text"
            className="form-control"
            value={aboveId}
            onChange={(e) => setAboveId(e.target.value)}
            placeholder="親グループIDを入力"
          />
        </label>
        <label className="form-label mt-3">
          ユーザーIDリスト:
          <textarea
            className="form-control"
            value={selectedUsers.join(",")}
            onChange={(e) => setSelectedUsers(e.target.value.split(","))}
            placeholder="ユーザーIDをカンマ区切りで入力"
          />
        </label>
        <button type="submit" className="btn btn-primary mt-3">
          グループ作成
        </button>
      </form>
    </div>
  );
}

export default GroupCreate;