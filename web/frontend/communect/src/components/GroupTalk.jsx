import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, ListGroup, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import styles from "../css/module/groupTalk.module.css";
import GroupTalkCreate from "./group/GroupTalkCreate";

const TalkRoom = ({ currentGroup, messages = [], onSendMessage, onSelectTalk }) => {
  const [messageText, setMessageText] = useState("");
  const [talks, setTalks] = useState([]);
  const [selectedTalk, setSelectedTalk] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // トークルーム一覧の取得
  const fetchTalks = async () => {
    if (!currentGroup?.groupId) {
      console.error("グループIDが設定されていません");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + `/group/${currentGroup.groupId}/talk`);
      if (response.data && response.data.talks) {
        setTalks(response.data.talks);
      } else {
        setError("トークルーム一覧が取得できませんでした。");
      }
    } catch (err) {
      console.error("トークルーム一覧の取得に失敗しました:", err);
      setError("トークルーム一覧の取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  // トークルーム選択
  const handleSelectTalk = (talkId) => {
    setSelectedTalk(talkId);
    if (typeof onSelectTalk === "function") {
      onSelectTalk(talkId);
    }
  };

  // トークルーム追加
  const updateTalkList = (newTalk) => {
    setTalks((prevTalks) => [...prevTalks, newTalk]);
  };

  // メッセージ送信
  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      user: "あなた",
      text: messageText,
      timestamp: new Date().toLocaleString(),
    };

    onSendMessage(currentGroup.groupId, newMessage);
    setMessageText("");
  };

  // スクロール制御
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 初回レンダリング時とグループ変更時にトークルーム一覧を取得
  useEffect(() => {
    if (currentGroup?.groupId) {
      fetchTalks();
    }
  }, [currentGroup?.groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Container fluid className={`${styles["talk-room"]} p-0`}>
      <Row className="m-0 h-100">
        {/* サイドバー */}
        <Col xs={3} className={`${styles.sidebar} p-0`}>
          <div className="d-flex justify-content-between align-items-center">
            <h5>トークルーム一覧</h5>
            <Button
              variant="link"
              className="text-primary"
              onClick={() => setShowCreateModal(true)}
            >
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
                  onClick={() => handleSelectTalk(talk.talkId)}
                >
                  {talk.talkName}
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p className="text-center mt-3">トークルームがありません。</p>
          )}
        </Col>

        {/* メッセージエリア */}
        <Col xs={9} className={`${styles["messages-container"]} p-0`}>
          <div className={`${styles.messages} flex-grow-1 overflow-auto`}>
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.message} ${
                    message.user === "あなた" ? styles.own : styles.other
                  }`}
                >
                  <div className={styles["message-bubble"]}>
                    <p className={styles["message-text"]}>{message.text}</p>
                    <p className={styles["message-info"]}>
                      <small>{message.user}</small> | <small>{message.timestamp}</small>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles["no-messages"]}>まだメッセージはありません。</p>
            )}
            <div ref={messagesEndRef}></div>
          </div>

          {/* メッセージ入力エリア */}
          <div className={styles["message-input"]}>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="メッセージを入力..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <Button variant="primary" onClick={handleSendMessage}>
              送信
            </Button>
          </div>
        </Col>
      </Row>

      {/* グループトーク作成モーダル */}
      <GroupTalkCreate
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onCreate={updateTalkList}
        groupId={currentGroup?.groupId}
      />
    </Container>
  );
};

export default TalkRoom;