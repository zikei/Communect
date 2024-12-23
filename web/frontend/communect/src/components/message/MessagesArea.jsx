import React from "react";
import { Col } from "react-bootstrap";
import styles from "../../css/module/groupTalk.module.css";
import MessageSender from "./MessageSender";

const MessagesArea = ({ messages, selectedTalk, messagesEndRef }) => {
  return (
    <Col xs={9} className={`${styles["messages-container"]} p-0`}>
      <div className={`${styles.messages} flex-grow-1 overflow-auto`}>
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.messageId}
              className={`${styles.message} ${
                message.userName === "あなた" ? styles.own : styles.other
              }`}
            >
              <div className={styles["message-bubble"]}>
                <p className={styles["message-text"]}>{message.message}</p>
                <p className={styles["message-info"]}>
                  <small>{message.nickName || message.userName}</small> |{" "}
                  <small>{new Date(message.createTime).toLocaleString()}</small>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className={styles["no-messages"]}>まだメッセージはありません。</p>
        )}
        <div ref={messagesEndRef}></div>
      </div>
      {selectedTalk && <MessageSender talkId={selectedTalk} />}
    </Col>
  );
};

export default MessagesArea;