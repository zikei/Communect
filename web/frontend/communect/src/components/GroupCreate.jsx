import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import UserSearch from "./group/UserSearch";
import axios from "axios";

function GroupCreate({ onSubmit, currentGroup, toggleModal }) {
  const [groupName, setGroupName] = useState("");
  const [parentGroupId, setParentGroupId] = useState(
    currentGroup?.groupId || null
  );
  const [addedUsers, setAddedUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setParentGroupId(currentGroup?.groupId || null);
  }, [currentGroup]);

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
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/group`,
        newGroup
      );
      alert("グループが作成されました。再読み込みを行ってください。");

      if (onSubmit) onSubmit(response.data);

      setGroupName("");
      setParentGroupId(null);
      setAddedUsers([]);
      setError(null);
      toggleModal();
    } catch (err) {
      console.error("グループ作成エラー:", err);
      setError("グループ作成中にエラーが発生しました。");
    }
  };

  return (
    <Modal show={true} onHide={toggleModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>グループ作成</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ minWidth: "400px", maxWidth: "600px", padding: "10px" }}>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="groupName" className="mb-3">
              <Form.Label>グループ名:</Form.Label>
              <Form.Control
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="グループ名を入力"
                required
              />
            </Form.Group>

            <Form.Group controlId="parentGroupId" className="mb-3">
              <Form.Label>親グループ:</Form.Label>
              <Form.Select
                value={parentGroupId || ""}
                onChange={(e) => setParentGroupId(e.target.value || null)}
              >
                <option value="">親グループなし</option>
                {currentGroup && (
                  <option value={currentGroup.groupId}>
                    {currentGroup.groupName}
                  </option>
                )}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="userSearch" className="mb-3">
              <Form.Label>ユーザーの追加:</Form.Label>
              <UserSearch onAddUsers={handleUserSelect} singleSelect={false} />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              グループ作成
            </Button>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default GroupCreate;
