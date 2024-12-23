import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import axios from "axios";
import styles from "../../css/module/messageSender.module.css";

const MessageSender = ({ talkId, onMessageSent }) => {
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    setSending(true);
    setError(null);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + `/talk/${talkId}/message`,
        { message: messageText }
      );

      if (response.data?.message) {
        onMessageSent(response.data.message);
        setMessageText(""); // 入力欄をクリア
      } else {
        setError("メッセージの送信に失敗しました。");
      }
    } catch (err) {
      console.error("メッセージ送信エラー:", err);
      setError("メッセージ送信中にエラーが発生しました。");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles["message-sender"]}>
      <InputGroup>
        <Form.Control
          as="textarea"
          rows={1}
          placeholder="メッセージを入力..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          disabled={sending}
          className={styles["message-input"]}
        />
        <Button
          variant="primary"
          onClick={handleSendMessage}
          disabled={!messageText.trim() || sending}
          className={`${styles["send-button"]} d-flex align-items-center`}
        >
          {sending ? (
            <span className="spinner-border spinner-border-sm"></span>
          ) : (
            <>
              <i className="bi bi-send me-2"></i>
              送信
            </>
          )}
        </Button>
      </InputGroup>
      {error && <p className="text-danger mt-2">{error}</p>}
    </div>
  );
};

export default MessageSender;
