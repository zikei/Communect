import React, { useState, useEffect } from "react";
import PostList from "./contact/PostList";
import PostFormModal from "./contact/PostFormModal";
import ReactionsModal from "./contact/ReactionsModal";
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

  // 投稿一覧を取得
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/group/${groupId}/contact`, {
        credentials: "include",
      });
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
    if (!groupId) return;
    const sse = new EventSource(`${import.meta.env.VITE_API_URL}/contact/sse`, {
      withCredentials: true,
    });

    const onMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("新しい投稿を受信:", data);

        if (data.type === "CREATE") {
          setPosts((prevPosts) => [...prevPosts, data.contact]);
        } else if (data.type === "UPDATE") {
          setPosts((prevPosts) => prevPosts.map(post => post.contactId === data.contact.contactId ? data.contact : post));
        } else if (data.type === "DELETE") {
          setPosts((prevPosts) => prevPosts.filter(post => post.contactId !== data.contactId));
        }
      } catch (err) {
        console.error("メッセージ解析中にエラーが発生しました:", err);
      }
    };

    const onError = () => {
      console.error("SSE接続に問題が発生しました");
      sse.close();
    };

    sse.addEventListener("message", onMessage);
    sse.addEventListener("error", onError);

    return () => {
      sse.removeEventListener("message", onMessage);
      sse.removeEventListener("error", onError);
      sse.close();
    };
  }, [groupId]);

  // 投稿編集
  const handleEditPost = async (contactId, updatedData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contact/${contactId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("投稿の編集に失敗しました。");
      fetchPosts(); // 最新の投稿を取得
    } catch (err) {
      alert(`エラー: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 投稿削除
  const handleDeletePost = async (contactId) => {
    if (!window.confirm("本当にこの投稿を削除しますか？") || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contact/${contactId}`, {
        method: "DELETE",
        credentials: "include",
      });

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contact/${contactId}`);
      if (!response.ok) throw new Error("詳細データの取得に失敗しました。");

      const result = await response.json();
      setSelectedPost(result.contact);
      setSelectedReactions(result.reactions || []);
      setShowReactionsModal(true);
    } catch (err) {
      alert(`エラー: ${err.message}`);
    }
  };

  useEffect(() => {
    if (groupId) fetchPosts();
  }, [groupId]);

  return (
    <div className="group-contact p-3">
      <header className="group-contact-header">
        <h1>{groupName}</h1>
        {hasPermission && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
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
          onPostCreated={fetchPosts} // 新しい投稿後にfetchPostsを呼び出す
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
