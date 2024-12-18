import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const ROLE_DISPLAY_MAP = {
  HIGH: "高",
  MEDIUM: "中",
  LOW: "低",
  SAFE: "最低",
  NONE: "なし",
};

function EditGroupMemberModal({ groupId, member, show, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nickName: member.nickName || "",
    role: member.role || "",
    isAdmin: member.isAdmin || false,
    isSubGroupCreate: member.isSubGroupCreate || false,
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    // 必須フィールドの検証
    if (!formData.nickName || !formData.role) {
      setError("All fields must be filled out.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const updatedMember = { ...member, ...formData };
    onSave(updatedMember); // 親コンポーネントに更新されたメンバー情報を渡す
    onClose(); // モーダルを閉じる
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Member</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nickname</Form.Label>
            <Form.Control
              type="text"
              name="nickName"
              value={formData.nickName}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Control
              as="select"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              {Object.keys(ROLE_DISPLAY_MAP).map((role) => (
                <option key={role} value={role}>
                  {ROLE_DISPLAY_MAP[role]}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Admin"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
            />
            <Form.Check
              type="checkbox"
              label="Can create sub-group"
              name="isSubGroupCreate"
              checked={formData.isSubGroupCreate}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

EditGroupMemberModal.propTypes = {
  groupId: PropTypes.string.isRequired,
  member: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditGroupMemberModal;
