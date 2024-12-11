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

  // 投稿一覧を取得
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/group/${groupId}/contact`
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

  // 投稿詳細とリアクションを取得
  const fetchPostDetails = async (contactId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/contact/${contactId}`
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

  // 初回ロードまたはグループID変更時に投稿一覧を取得
  useEffect(() => {
    if (groupId) {
      fetchPosts();
    }
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

      {/* 投稿一覧 */}
      <PostList
        posts={posts}
        error={error}
        loading={loading}
        onFetchDetails={fetchPostDetails}
        reactions={selectedReactions}
      />

      {/* 投稿フォームモーダル */}
      {showModal && (
        <PostFormModal
          onClose={() => setShowModal(false)}
          groupId={groupId}
          onPostCreated={(newPost) => setPosts((prev) => [newPost, ...prev])}
        />
      )}

      {/* リアクションモーダル */}
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
