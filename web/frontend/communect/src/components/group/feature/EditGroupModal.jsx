import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

function EditGroupModal({ group, onClose, onUpdateGroup }) {
  const [name, setName] = useState(group.groupName || "");
  const [above, setAbove] = useState(group.aboveGroupId || "");

  const handleSave = async () => {
    try {
      const payload = {
        name: name.trim() || null,
        above: above.trim() || null,
      };

      const response = await axios.put(import.meta.env.VITE_API_URL + `/group/${group.groupId}`, payload);
      if (response.status === 200) {
        onUpdateGroup(group.groupId, payload); // 親に通知
        onClose(); // モーダルを閉じる
      }
    } catch (error) {
      console.error("グループ更新エラー:", error);
      alert("グループの更新に失敗しました");
    }
  };

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal-container">
        <div className="custom-modal-header">
          <h5 className="custom-modal-title">グループ編集</h5>
          <button className="custom-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="custom-modal-body">
          <div className="form-group">
            <label>グループ名</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>上位グループID</label>
            <input
              type="text"
              className="form-control"
              value={above}
              onChange={(e) => setAbove(e.target.value)}
            />
          </div>
        </div>
        <div className="custom-modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            キャンセル
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

EditGroupModal.propTypes = {
  group: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateGroup: PropTypes.func.isRequired,
};

export default EditGroupModal;