import React, { useState } from "react";
import { Col, ListGroup, Button, Spinner, Alert, Modal, Form } from "react-bootstrap";
import styles from "../../css/module/groupTalk.module.css";
import axios from "axios";

const TalkSidebar = ({
  talks,
  loading,
  error,
  onSelectTalk,
  setShowCreateModal,
  selectedTalk,
  onTalksUpdate,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTalk, setEditingTalk] = useState(null);
  const [newTalkName, setNewTalkName] = useState("");
  const [deleteError, setDeleteError] = useState(null);

  const handleEditTalk = async () => {
    if (!editingTalk) return;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/talk/${editingTalk.talkId}`,
        { talkName: newTalkName },
        { withCredentials: true },
      );
      const updatedTalk = response.data.talk;

      const updatedTalks = talks.map((talk) =>
        talk.talkId === updatedTalk.talkId ? updatedTalk : talk
      );
      onTalksUpdate(updatedTalks);

      setEditingTalk(null);
      setShowEditModal(false);
      setNewTalkName("");
    } catch (err) {
      console.error("トーク名の編集に失敗しました。", err);
    }
  };

  const handleDeleteTalk = async (talkId) => {
    const userConfirmed = window.confirm("本当に削除してもよろしいですか？");
  
    if (!userConfirmed) {
      return; //　キャンセルを選択した場合は処理を中断
    }
  
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/talk/${talkId}`);
  
      const updatedTalks = talks.filter((talk) => talk.talkId !== talkId);
      onTalksUpdate(updatedTalks);
    } catch (err) {
      setDeleteError("トークルームの削除に失敗しました。");
      console.error("トークルームの削除に失敗しました。", err);
    }
  };

  return (
    <Col xs={3} className={`${styles["groupTalk-sidebar"]} p-0`}>
      <div className="d-flex justify-content-between align-items-center">
        <h5>トークルーム一覧</h5>
        <Button variant="link" className="text-primary" onClick={() => setShowCreateModal(true)}>
          <i className="bi bi-plus-circle" style={{ fontSize: "1.5rem" }}></i>
        </Button>
      </div>
      {loading ? (
        <div className="text-center mt-3">
          <Spinner animation="border" role="status" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : talks.length > 0 ? (
        <ListGroup>
          {talks.map((talk) => (
            <ListGroup.Item
              key={talk.talkId}
              action
              active={talk.talkId === selectedTalk}
              onClick={() => onSelectTalk(talk.talkId)}
            >
              <div className="d-flex justify-content-between align-items-center">
                <span>{talk.talkName}</span>
                <div>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-warning"
                    onClick={() => {
                      setEditingTalk(talk);
                      setNewTalkName(talk.talkName);
                      setShowEditModal(true);
                    }}
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-danger"
                    onClick={() => handleDeleteTalk(talk.talkId)}
                  >
                    <i className="bi bi-trash-fill"></i>
                  </Button>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-center mt-3">トークルームがありません。</p>
      )}

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>トークルームを編集</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>トーク名</Form.Label>
              <Form.Control
                type="text"
                value={newTalkName}
                onChange={(e) => setNewTalkName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            キャンセル
          </Button>
          <Button variant="primary" onClick={handleEditTalk}>
            保存
          </Button>
        </Modal.Footer>
      </Modal>

      {deleteError && <Alert variant="danger" className="mt-2">{deleteError}</Alert>}
    </Col>
  );
};

export default TalkSidebar;