import React, { useState, useEffect, useRef } from "react";
import "../css/groupTalk.css";

const TalkRoom = ({ group, messages, onSendMessage }) => {
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

  // メッセージリストの最後にスクロールする処理
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // メッセージが更新されるたびにスクロール

  return (
    <div className="talk-room">
      {/* メッセージ表示エリア */}
      <div className="messages">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.user === "あなた" ? "own" : "other"}`}
            >
              <div className="message-bubble">
                <p className="message-text">{message.text}</p>
                <p className="message-info">
                  <small>{message.user}</small> | <small>{message.timestamp}</small>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-messages">まだメッセージはありません。</p>
        )}
        <div ref={messagesEndRef}></div> {/* スクロール制御用ダミー要素 */}
      </div>

      {/* メッセージ入力エリア */}
      <div className="message-input">
        <textarea
          placeholder="メッセージを入力..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        ></textarea>
        <button onClick={handleSendMessage}>送信</button>
      </div>
    </div>
  );
};

export default TalkRoom;
