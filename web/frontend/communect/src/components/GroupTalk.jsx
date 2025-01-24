import React, { useState, useEffect, useRef } from "react";
import { Container, Row } from "react-bootstrap";
import axios from "axios";
import styles from "../css/module/groupTalk.module.css";
import GroupTalkCreate from "./group/GroupTalkCreate";
import TalkSidebar from "./group/GroupTalkSidebar";
import MessagesArea from "./message/MessagesArea";

const TalkRoom = ({ currentGroup, onSelectTalk }) => {
  const [selectedTalk, setSelectedTalk] = useState(null);
  const [messages, setMessages] = useState([]);
  const [talks, setTalks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const fetchTalks = async () => {
    if (!currentGroup?.groupId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/group/${currentGroup.groupId}/talk`,
        {
          withCredentials: true,
          credentials: "include",
        }
      );
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
    if (currentGroup?.groupId) {
      fetchTalks();
    }
  }, [currentGroup?.groupId]);

  useEffect(() => {
    if (!currentGroup?.groupId || !selectedTalk) return;

    let sse; // SSE接続用の変数

    const connectSSE = () => {
      sse = new EventSource(`${import.meta.env.VITE_API_URL}/message/sse`, {
        withCredentials: true,
        credentials: "include",
      });

      // 接続確認イベント
      sse.addEventListener("connection", (event) => {
        console.log("接続イベント:", event.data);
      });

      sse.addEventListener("post", (event) => {
        console.log("POSTイベント:", event.data);
        try {
          // レスポンスの解析
          const response = JSON.parse(event.data);
          const newMessage = response.message; // `message`オブジェクトを取得
      
          // 現在のトークルームにのみメッセージを追加
          if (newMessage && selectedTalk === newMessage.talkId) { // `talkId`がレスポンスにない場合のチェックを追加
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          } else {
            console.log("メッセージが現在のトークルームではありません");
          }
        } catch (err) {
          console.error("POSTイベント解析エラー:", err);
        }
      });

      // メッセージ更新イベント
      sse.addEventListener("update", (event) => {
        console.log("UPDATEイベント:", event.data);
        try {
          const updatedMessage = JSON.parse(event.data);
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.messageId === updatedMessage.messageId ? updatedMessage : msg
            )
          );
        } catch (err) {
          console.error("UPDATEイベント解析エラー:", err);
        }
      });

      // メッセージ削除イベント
      sse.addEventListener("delete", (event) => {
        console.log("DELETEイベント:", event.data);
        try {
          const deletedMessage = JSON.parse(event.data);
          setMessages((prevMessages) =>
            prevMessages.filter(
              (msg) => msg.messageId !== deletedMessage.messageId
            )
          );
        } catch (err) {
          console.error("DELETEイベント解析エラー:", err);
        }
      });

      // エラー処理
      sse.onerror = (event) => {
        console.error("SSEエラーが発生しました:", event);
        sse.close();
        // 再接続ロジックを追加
        setTimeout(() => {
          console.log("SSE再接続を試みます...");
          connectSSE(); // 再接続
        }, 5000); // 5秒後に再接続
      };
    };

    connectSSE(); // 初回接続

    // クリーンアップ処理
    return () => {
      if (sse) {
        console.log("SSE接続を閉じます");
        sse.close();
      }
    };
  }, [currentGroup?.groupId, selectedTalk]); // selectedTalkが変わるたびに再接続

  const handleSendMessage = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleSelectTalk = (talkId) => {
    setSelectedTalk(talkId);
    fetchMessages(talkId);
    if (onSelectTalk) onSelectTalk(talkId);
  };

  const handleEditMessage = async (messageId, updatedText) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/message/${messageId}`,
        { message: updatedText },
        {
          withCredentials: true,
        }
      );
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
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/message/${messageId}`,
        {
          withCredentials: true,
        }
      );
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.messageId !== messageId)
      );
    } catch (err) {
      console.error("メッセージの削除に失敗しました。", err);
    }
  };

  const handleTalkUpdate = (updatedTalks) => {
    setTalks(updatedTalks);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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
          onTalksUpdate={handleTalkUpdate} // 追加
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
        groupId={currentGroup?.groupId}
        onCreate={(newTalk) => setTalks((prevTalks) => [...prevTalks, newTalk])}
        talkType="group"
      />
    </Container>
  );
};

export default TalkRoom;
