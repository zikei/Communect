import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import UserSearch from "./group/UserSearch";
import axios from "axios";

function GroupCreate({ onSubmit, currentGroup, toggleModal }) {
  const [groupName, setGroupName] = useState("");
  const [parentGroupId, setParentGroupId] = useState(currentGroup?.groupId || null);
  const [addedUsers, setAddedUsers] = useState([]);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // 現在のログインユーザー情報

  useEffect(() => {
    setParentGroupId(currentGroup?.groupId || null);
  }, [currentGroup]);

  // ログイン中のユーザー情報を取得
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + "/user/login", {
          withCredentials: true,
          credentials: "include",
        });
        setCurrentUser(response.data); // 取得したユーザー情報を保存
      } catch (error) {
        console.error("現在のユーザー情報の取得に失敗しました:", error);
        setCurrentUser(null);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleUserSelect = (user) => {
    if (!currentUser || user.userId === currentUser.userId) return; // 自分を選択不可にする
  
    if (singleSelect) {
      setSelectedUsers([user]);
      onAddUsers([user]);
    } else {
      const isSelected = selectedUsers.some((u) => u.userId === user.userId);
      const updatedUsers = isSelected
        ? selectedUsers.filter((u) => u.userId !== user.userId)
        : [...selectedUsers, user];
  
      setSelectedUsers(updatedUsers);
      onAddUsers(updatedUsers);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      setError("グループ名は必須です。");
      return;
    }

    if (!currentUser) {
      setError("現在のユーザー情報を取得できませんでした。");
      return;
    }

    // 自分自身の userId を除外
    const filteredUsers = addedUsers
      .filter(user => user.userId !== currentUser.userId)
      .map(user => user.userId);

    const newGroup = {
      name: groupName.trim(),
      above: parentGroupId || null,
      users: filteredUsers, // 自分を除外したリストを送信
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/group`, newGroup, {
          withCredentials: true,
          credentials: "include",
        }
      );

      if (onSubmit) onSubmit(response.data.group);

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
