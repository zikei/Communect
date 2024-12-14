import React, { useState, useEffect } from "react";
import "../css/groupCreate.css";

function GroupCreate({ onSubmit, currentGroup, availableUsers, toggleModal }) {
  const [groupName, setGroupName] = useState("");
  const [parentGroupId, setParentGroupId] = useState(currentGroup?.groupId || null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState(null);

  // モーダルが開かれたときに親グループを初期化
  useEffect(() => {
    setParentGroupId(currentGroup?.groupId || null);
  }, [currentGroup]);

  const handleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      setError("グループ名は必須です。");
      return;
    }

    const newGroup = {
      name: groupName.trim(),
      parentGroupId: parentGroupId || null,
    };

    try {
      onSubmit(newGroup);

      for (const userId of selectedUsers) {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/group/${currentGroup.groupId}/user`,
          { userId }
        );
      }

      setGroupName("");
      setParentGroupId(null);
      setSelectedUsers([]);
      setError(null);
    } catch (err) {
      console.error("Error adding users to group:", err);
      setError("ユーザーの追加中にエラーが発生しました。");
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
              <div className="user-selection">
                {availableUsers.map((user) => (
                  <div key={user.id} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`user-${user.id}`}
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserSelection(user.id)}
                    />
                    <label htmlFor={`user-${user.id}`} className="form-check-label">
                      {user.name} ({user.email})
                    </label>
                  </div>
                ))}
              </div>
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
