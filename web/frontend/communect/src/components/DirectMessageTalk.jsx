import React, { useState, useEffect, useRef } from "react";
import { Container, Row } from "react-bootstrap";
import axios from "axios";
import styles from "../css/module/groupTalk.module.css";
import GroupTalkCreate from "./group/GroupTalkCreate";
import TalkSidebar from "./group/GroupTalkSidebar";
import MessagesArea from "./message/MessagesArea";

const TalkRoom = ({ onSelectTalk }) => {
  const [selectedTalk, setSelectedTalk] = useState(null);
  const [messages, setMessages] = useState([]);
  const [talks, setTalks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const fetchTalks = async () => {

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/talk`,{
        withCredentials: true,
        credentials: "include",
      });
      setTalks(response.data.talks || []);
    } catch (err) {
      setError("トークルーム一覧の取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (talkId) => {
    if (!talkId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/talk/${talkId}/message`,
        {
          withCredentials: true,
          credentials: "include",
        }
      );
      setMessages(response.data.messages || []);
    } catch (err) {
      setError("メッセージ一覧の取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedTalk) return;

    let sse;

    const connectSSE = () => {
      if (sse) {
        sse.close();
      }

      sse = new EventSource(
        `${import.meta.env.VITE_API_URL}/message/sse`,
        {
          withCredentials: true,
          credentials: "include",
        }
      );

      sse.addEventListener("post", (event) => {
        try {
          const response = JSON.parse(event.data);
          const newMessage = response.message;

          if (newMessage && newMessage.talkId === selectedTalk) {
            setMessages((prevMessages) => {
              if (prevMessages.some((msg) => msg.messageId === newMessage.messageId)) {
                return prevMessages;
              }
              return [...prevMessages, newMessage];
            });
          }
        } catch (err) {
          console.error("POSTイベント解析エラー:", err);
        }
      });

      sse.addEventListener("update", (event) => {
        try {
          const response = JSON.parse(event.data);
          const updatedMessage = response.message;

          if (updatedMessage && updatedMessage.talkId === selectedTalk) {
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.messageId === updatedMessage.messageId ? updatedMessage : msg
              )
            );
          }
        } catch (err) {
          console.error("UPDATEイベント解析エラー:", err);
        }
      });

      sse.addEventListener("delete", (event) => {
        try {
          const response = JSON.parse(event.data);
          const deletedMessageId = response.messageId;

          setMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.messageId !== deletedMessageId)
          );
        } catch (err) {
          console.error("DELETEイベント解析エラー:", err);
        }
      });

      sse.onerror = (event) => {
        console.error("SSEエラーが発生しました:", event);
        sse.close();

        setTimeout(() => {
          connectSSE();
        }, 5000);
      };
    };

    connectSSE();

    return () => {
      if (sse) {
        sse.close();
      }
    };
  }, [selectedTalk]);

  const handleSendMessage = (newMessage) => {
    setMessages((prevMessages) => {
      if (prevMessages.some((msg) => msg.messageId === newMessage.messageId)) {
        return prevMessages; // 重複メッセージを無視
      }
      return [...prevMessages, newMessage];
    });
  };

  const handleSelectTalk = (talkId) => {
    setSelectedTalk(talkId);
    fetchMessages(talkId);
    if (onSelectTalk) onSelectTalk(talkId);
  };

  const handleEditMessage = async (messageId, updatedText) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/message/${messageId}`, {
        message: updatedText,
      }, {
        withCredentials: true,
        credentials: "include",
      });
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.messageId === messageId
            ? { ...message, message: updatedText }
            : message
        )
      );
    } catch (err) {
      console.error("メッセージの編集に失敗しました。", err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/message/${messageId}`,
      {
        withCredentials: true,
        credentials: "include",
      }
      );
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.messageId !== messageId)
      );
    } catch (err) {
      console.error("メッセージの削除に失敗しました。", err);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    fetchTalks();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Container fluid className={`${styles["talk-room"]} p-0`}>
      <Row className="m-0 h-100">
        <TalkSidebar
          talks={talks}
          loading={loading}
          error={error}
          onSelectTalk={handleSelectTalk}
          setShowCreateModal={setShowCreateModal}
          selectedTalk={selectedTalk}
          onTalksUpdate={(updatedTalks) => setTalks(updatedTalks)}
        />
        <MessagesArea
          messages={messages}
          selectedTalk={selectedTalk}
          messagesEndRef={messagesEndRef}
          onSendMessage={handleSendMessage}
          onEditMessage={handleEditMessage}
          onDeleteMessage={handleDeleteMessage}
        />
      </Row>
      <GroupTalkCreate
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onCreate={(newTalk) => setTalks((prevTalks) => [...prevTalks, newTalk])}
        talkType="personal"
      />
    </Container>
  );
};

export default TalkRoom;
