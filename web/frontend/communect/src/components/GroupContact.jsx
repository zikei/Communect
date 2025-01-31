import React, { useState, useEffect } from "react";
import PostList from "./contact/PostList";
import PostFormModal from "./contact/PostFormModal";
import ReactionsModal from "./contact/ReactionsModal";
import Notifications from "./contact/Notifications";
import "../css/groupContact.css";

function GroupContact({ groupName, hasPermission, groupId }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showReactionsModal, setShowReactionsModal] = useState(false);
  const [selectedReactions, setSelectedReactions] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [reactedPosts, setReactedPosts] = useState(new Set());

  // 投稿一覧を取得
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/group/${groupId}/contact`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("データの取得に失敗しました。");
      const result = await response.json();
      setPosts(result.contacts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  // SSE接続
  useEffect(() => {
    let sse; // SSE接続用の変数
    const connectSSE = () => {
      sse = new EventSource(`${import.meta.env.VITE_API_URL}/contact/sse`, {
        withCredentials: true,
        credentials: "include",
      });

      // 接続確認イベント
      sse.addEventListener("connection", (event) => {
        console.log("接続イベント:", event.data);
      });

      // 新規データ追加イベント
      sse.addEventListener("post", (event) => {
        console.log("POSTイベント:", event.data);
        try {
          const data = JSON.parse(event.data);
      
          // データ構造を検証
          const contact = data.contact || {};
          if (!contact.contactId || !contact.contactType) {
            console.error("無効なデータ形式:", data);
            return;
          }
      
          const validatedChoices = Array.isArray(contact.choices) && contact.choices.every(c => typeof c === 'object' && c.choice)
            ? contact.choices.reverse()
            : [];
          
          setPosts((prevPosts) => [...prevPosts, contact]);
      
          addNotification(
            contact.message || "タイトル未設定",
            contact.contactId,
            contact.contactType,
            validatedChoices
          );
        } catch (err) {
          console.error("POSTイベント解析エラー:", err);
        }
      });

      // データ更新イベント
      sse.addEventListener("update", (event) => {
        console.log("UPDATEイベント:", event.data);
        try {
          const data = JSON.parse(event.data);
          const contact = data.contact || {};
      
          if (!contact.contactId) {
            console.error("無効なデータ形式:", data);
            return;
          }
      
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.contactId === contact.contactId
                ? { ...post, ...contact, choices: contact.choices || [] }
                : post
            )
          );
        } catch (err) {
          console.error("UPDATEイベント解析エラー:", err);
        }
      });

      // データ削除イベント
      sse.addEventListener("delete", (event) => {
        console.log("DELETEイベント:", event.data);
        try {
          const data = JSON.parse(event.data);
          setPosts((prevPosts) =>
            prevPosts.filter((post) => post.contactId !== data.contactId)
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
          connectSSE();
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
  }, []);

  // 投稿編集
  const handleEditPost = async (contactId, updatedData) => {
    if (isSubmitting) return;
  
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/contact/${contactId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedData),
        }
      );

      window.confirm("既にリアクションがある場合、リアクションは消えますが、よろしいですか？");
      if (!response.ok) throw new Error("投稿の編集に失敗しました。");
  
      const updatedPost = await response.json();
  
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.contactId === contactId ? { ...post, ...updatedPost } : post
        )
      );
    } catch (err) {
      alert(`エラー: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 投稿削除
  const handleDeletePost = async (contactId) => {
    if (!window.confirm("本当にこの投稿を削除しますか？") || isSubmitting)
      return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/contact/${contactId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("投稿の削除に失敗しました。");
      fetchPosts(); // 最新の投稿を取得
    } catch (err) {
      alert(`エラー: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 投稿詳細とリアクションを取得
  const fetchPostDetails = async (contactId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/contact/${contactId}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("詳細データの取得に失敗しました。");

      const result = await response.json();
      setSelectedPost(result.contact);
      setSelectedReactions(result.reactions || []);
      setShowReactionsModal(true);
    } catch (err) {
      alert(`エラー: ${err.message}`);
    }
  };

  // 通知機能
  const addNotification = (message, postId, contactType, choices = []) => {
    // choicesが配列であり、各要素がオブジェクトであるか確認
    const validatedChoices = Array.isArray(choices) && choices.every(c => typeof c === 'object' && c.choice)
      ? choices
      : [];
      
    setNotifications((prev) => [
      ...prev,
      { message, postId, contactType: contactType || "UNKNOWN", choices: validatedChoices }
    ]);
  };

  const removeNotification = (postId) => {
    setNotifications((prev) => prev.filter((notif) => notif.postId !== postId));
  };

  const handleReaction = (postId, reaction) => {
    fetch(`${import.meta.env.VITE_API_URL}/group/reaction`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, reaction }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("リアクションが送信されました:", data);
      })
      .catch((err) => {
        console.error("リアクション送信エラー:", err);
      });
  };

  useEffect(() => {
    if (groupId) fetchPosts();
  }, [groupId]);

  return (
    <div className="group-contact p-3">
      {/* 通知UI */}
      <Notifications
        notifications={notifications}
        onRemoveNotification={removeNotification}
        onReact={handleReaction}
      />
      <header className="group-contact-header">
        <h1>{groupName}</h1>
        {hasPermission && (
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            投稿
          </button>
        )}
      </header>

      <PostList
        posts={posts}
        error={error}
        loading={loading}
        onFetchDetails={fetchPostDetails}
        onEditPost={handleEditPost}
        onDeletePost={handleDeletePost}
      />

      {showModal && (
        <PostFormModal
          onClose={() => setShowModal(false)}
          groupId={groupId}
          onPostCreated={fetchPosts}
        />
      )}

      {showReactionsModal && (
        <ReactionsModal
          reactions={selectedReactions}
          post={selectedPost}
          onClose={() => setShowReactionsModal(false)}
        />
      )}
    </div>
  );
}

export default GroupContact;
