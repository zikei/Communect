import React, { useEffect, useState, useRef } from "react";
import { Col, Button } from "react-bootstrap";
import axios from "axios";
import styles from "../../css/module/groupTalk.module.css";
import MessageSender from "./MessageSender";

const MessagesArea = ({
  messages,
  selectedTalk,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // ログインユーザー情報を取得
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + "/user/login", {
          withCredentials: true,
          credentials: "include",
        });
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error("ログインユーザー情報の取得に失敗しました:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  // メッセージ送信後、最下部にスクロールする
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // スクロールが一番下にある場合、送信後に最下部にスクロール
    const container = messagesContainerRef.current;
    const isAtBottom = container.scrollHeight === container.scrollTop + container.clientHeight;
    
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages]); // 依存配列にmessagesを追加

  const startEditing = (messageId, currentText) => {
    setEditingMessageId(messageId);
    setEditingText(currentText);
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditingText("");
  };

  const saveEditing = () => {
    if (editingMessageId && editingText.trim()) {
      onEditMessage(editingMessageId, editingText.trim());
      cancelEditing();
    }
  };

  const isOwnMessage = (messageUserId) => {
    return currentUser && currentUser.userId === messageUserId;
  };

  return (
    <Col xs={9} className={`${styles["messages-container"]} p-0`}>
      <div
        className={`${styles.messages} flex-grow-1 overflow-auto`}
        ref={messagesContainerRef} // メッセージコンテナにrefを追加
      >
        {messages.length > 0 ? (
          // メッセージを降順に表示（最新のメッセージが下に）
          [...messages].reverse().map((message) => (
            <div
              key={message.messageId}
              className={`${styles.message} ${
                isOwnMessage(message.userId) ? styles.own : styles.other
              }`}
            >
              <div className={styles["message-bubble"]}>
                {editingMessageId === message.messageId ? (
                  <div>
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className={styles["edit-input"]}
                    />
                    <div className={styles["edit-actions"]}>
                      <Button variant="success" onClick={saveEditing}>
                        保存
                      </Button>
                      <Button variant="secondary" onClick={cancelEditing}>
                        キャンセル
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className={styles["message-text"]}>{message.message}</p>
                )}
                <p className={styles["message-info"]}>
                  <small>{message.nickName || message.userName}</small> |{" "}
                  <small>{new Date(message.createTime).toLocaleString()}</small>
                </p>
              </div>
              {isOwnMessage(message.userId) && (
                <div className={styles["message-actions"]}>
                  <Button
                    variant="link"
                    onClick={() =>
                      startEditing(message.messageId, message.message)
                    }
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="link"
                    onClick={() => onDeleteMessage(message.messageId)}
                  >
                    <i className="bi bi-trash3"></i>
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className={styles["no-messages"]}>まだメッセージはありません。</p>
        )}
        {/* 最後のメッセージの下にスクロールを誘導 */}
        <div ref={messagesEndRef}></div>
      </div>
      {selectedTalk && <MessageSender talkId={selectedTalk} onMessageSent={onSendMessage} />}
    </Col>
  );
};

export default MessagesArea;