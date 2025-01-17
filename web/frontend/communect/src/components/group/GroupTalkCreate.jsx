import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import axios from "axios";
import UserSearch from "./UserSearch";

const GroupTalkCreate = ({ show, onHide, onCreate, groupId, talkType }) => {
  const [talkName, setTalkName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // 個人トーク用の選択ユーザ
  const [error, setError] = useState(null);

  const handleCreate = async () => {
    if (!talkName.trim()) {
      setError("トーク名を入力してください。");
      return;
    }

    try {
      let response;
      if (talkType === "group") {
        // グループトークの作成
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/group/${groupId}/talk`,
          { talkName: talkName.trim() }
        );
      } else if (talkType === "personal" && selectedUser) {
        // 個人トークの作成
        response = await axios.post(`${import.meta.env.VITE_API_URL}/talk`, {
          talkName: talkName.trim(),
          userId: selectedUser.userId,
        });
      } else {
        setError("個人トークを作成するにはユーザを選択してください。");
        return;
      }

      if (response?.data?.talk) {
        onCreate(response.data.talk, talkType);
        resetForm();
      }
    } catch (err) {
      setError("トークルームの作成に失敗しました。もう一度お試しください。");
    }
  };

  const resetForm = () => {
    setTalkName("");
    setSelectedUser(null);
    setError(null);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {talkType === "group" ? "グループトークを作成" : "個人トークを作成"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group controlId="formTalkName">
            <Form.Label>トーク名</Form.Label>
            <Form.Control
              type="text"
              placeholder="新しいトーク名を入力してください"
              value={talkName}
              onChange={(e) => setTalkName(e.target.value)}
            />
          </Form.Group>
          {talkType === "personal" && (
            <div className="mt-3">
              <Form.Label>ユーザを検索</Form.Label>
              <UserSearch
                onAddUsers={(users) => setSelectedUser(users[0])}
                singleSelect={true}
              />
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          キャンセル
        </Button>
        <Button variant="primary" onClick={handleCreate}>
          作成
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

GroupTalkCreate.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  groupId: PropTypes.string, // グループトークのみで必要
  talkType: PropTypes.oneOf(["group", "personal"]).isRequired, // トークタイプを必須プロパティ化
};

export default GroupTalkCreate;