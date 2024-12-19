import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import axios from "axios";

const GroupTalkCreate = ({ show, onHide, onCreate, groupId }) => {
  const [talkName, setTalkName] = useState("");
  const [error, setError] = useState(null);

  const handleCreate = async () => {
    if (!talkName.trim()) return;

    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + `/group/${groupId}/talk`, {
        talkName: talkName.trim(),
      });

      if (response.data?.talk) {
        onCreate(response.data.talk); // 作成したトーク情報を親コンポーネントに渡す
        setTalkName(""); // フォームをリセット
        setError(null); // エラーをリセット
        onHide(); // モーダルを閉じる
      }
    } catch (err) {
      setError("トークルームの作成に失敗しました。もう一度お試しください。");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>グループトークを作成</Modal.Title>
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
  groupId: PropTypes.string.isRequired, // グループIDを必須として受け取る
};

export default GroupTalkCreate;
