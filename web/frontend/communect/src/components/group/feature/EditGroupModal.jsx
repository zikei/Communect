import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

function EditGroupModal({ group, onClose, onUpdateGroup }) {
  const [name, setName] = useState(group.groupName || "");
  const [isParentGroup, setIsParentGroup] = useState(!group.aboveGroupId);

  useEffect(() => {
    if (!isParentGroup) {
      fetchGroupOptions();
    }
  }, [isParentGroup]);

  const handleSave = async () => {
    try {
      const payload = {
        name: name.trim() || null,
      };
  
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/group/${group.groupId}`,
        payload,
        { withCredentials: true }
      );
  
      if (response.status === 200) {
        onUpdateGroup(group.groupId, payload.name); // 親に変更を通知
        onClose();
      }
    } catch (error) {
      console.error("グループ更新エラー:", error);
      alert("グループの更新に失敗しました");
    }
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>グループ編集</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="groupName">
            <Form.Label>グループ名</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="グループ名を入力"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          キャンセル
        </Button>
        <Button variant="primary" onClick={handleSave}>
          保存
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

EditGroupModal.propTypes = {
  group: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateGroup: PropTypes.func.isRequired,
};

export default EditGroupModal;
