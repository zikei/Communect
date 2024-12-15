import React, { useState, useEffect, useCallback } from "react";
import "../css/groupCreate.css";
import UserSearch from "./group/UserSearch";
import axios from "axios";

function GroupCreate({ onSubmit, currentGroup, toggleModal }) {
  const [groupName, setGroupName] = useState("");
  const [parentGroupId, setParentGroupId] = useState(currentGroup?.groupId || null);
  const [addedUsers, setAddedUsers] = useState([]);
  const [error, setError] = useState(null);

  // モーダル開く時に親グループ初期化
  useEffect(() => {
    setParentGroupId(currentGroup?.groupId || null);
  }, [currentGroup]);

  // ユーザー選択コールバック（useCallbackで再レンダリングを最適化）
  const handleUserSelect = useCallback((selectedUsers) => {
    setAddedUsers(selectedUsers);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      setError("グループ名は必須です。");
      return;
    }

    const newGroup = {
      name: groupName.trim(),
      above: parentGroupId || null,
      users: addedUsers.map((user) => user.userId),
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/group`, newGroup);
      alert("グループが作成されました。再読み込みを行ってください。");

      if (onSubmit) onSubmit(response.data);

      setGroupName("");
      setParentGroupId(null);
      setAddedUsers([]);
      setError(null);
      toggleModal(); // モーダルを閉じる
    } catch (err) {
      console.error("グループ作成エラー:", err);
      setError("グループ作成中にエラーが発生しました。");
    }
  };

  return (
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">グループ作成</h5>
          <button className="btn-close" onClick={toggleModal}></button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="groupName" className="form-label">
                グループ名:
              </label>
              <input
                type="text"
                className="form-control"
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="グループ名を入力"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="parentGroupId" className="form-label">
                親グループ:
              </label>
              <select
                className="form-select"
                id="parentGroupId"
                value={parentGroupId || ""}
                onChange={(e) => setParentGroupId(e.target.value || null)}
              >
                <option value="">親グループなし</option>
                {currentGroup && (
                  <option value={currentGroup.groupId}>
                    {currentGroup.groupName}
                  </option>
                )}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">ユーザーの追加:</label>
              <UserSearch onAddUsers={handleUserSelect} />
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">
                グループ作成
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default GroupCreate;
