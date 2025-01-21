import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Modal, Button, Alert, Spinner } from "react-bootstrap";
import UserSearch from "../../group/UserSearch";

function AddUserModal({ groupId, show, onClose, onAddUser }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  const handleAddUser = async () => {
    if (!selectedUser) return;

    setAdding(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/group/${groupId}/user`,
        { userId: selectedUser.userId },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        onAddUser(selectedUser);
        onClose();
      } else {
        throw new Error("Failed to add user");
      }
    } catch (err) {
      console.error("Error adding user:", err);
      setError("ユーザーの追加に失敗しました。もう一度試してください。");
    } finally {
      setAdding(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>ユーザを追加</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ minWidth: "400px", maxWidth: "600px", padding: "10px" }}>
          {error && <Alert variant="danger">{error}</Alert>}
          <UserSearch
            onAddUsers={(users) => setSelectedUser(users[0] || null)}
            singleSelect
          />
          {selectedUser && (
            <div className="mt-3">
              <Alert variant="info">
                <strong>選択されたユーザ:</strong> {selectedUser.userName} (
                {selectedUser.nickName})
              </Alert>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          キャンセル
        </Button>
        <Button
          variant="primary"
          onClick={handleAddUser}
          disabled={!selectedUser || adding}
        >
          {adding ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            "追加"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

AddUserModal.propTypes = {
  groupId: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddUser: PropTypes.func.isRequired,
};

export default AddUserModal;
