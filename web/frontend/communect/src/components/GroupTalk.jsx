import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, ListGroup, Form, Button } from "react-bootstrap";
import styles from "../css/module/groupTalk.module.css";

const TalkRoom = ({ group = {}, messages = [], onSendMessage, onSelectTalk }) => {
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null); // スクロール制御用の参照

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      user: "あなた",
      text: messageText,
      timestamp: new Date().toLocaleString(),
    };

    onSendMessage(group.groupId, newMessage);
    setMessageText("");
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // メッセージが更新されるたびにスクロール

  return (
    <Container fluid className={`${styles["talk-room"]} p-0`}>
      <Row className="m-0 h-100">
        {/* サイドバー */}
        <Col xs={3} className={`${styles.sidebar} p-0`}>
          <h5>トークルーム一覧</h5>
          <ListGroup>
            {(group.talks || []).map((talk) => (
              <ListGroup.Item
                key={talk.talkId}
                action
                onClick={() => onSelectTalk(talk.talkId)}
              >
                {talk.talkName}
              </ListGroup.Item>
            ))}
          </ListGroup>
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
            <div ref={messagesEndRef}></div> {/* スクロール制御用ダミー要素 */}
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
    </Container>
  );
};

export default TalkRoom;
