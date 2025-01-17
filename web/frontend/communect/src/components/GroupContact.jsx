import React, { useState, useEffect } from "react";
import PostList from "./contact/PostList";
import PostFormModal from "./contact/PostFormModal";
import ReactionsModal from "./contact/ReactionsModal";
import "../css/groupContact.css";

function GroupContact({ groupName, hasPermission, groupId }) {
  const [posts, setPosts] = useState([]); // 投稿データの状態
  const [error, setError] = useState(null); // エラーの状態
  const [loading, setLoading] = useState(false); // ローディングの状態
  const [showModal, setShowModal] = useState(false); // 投稿フォームモーダルの表示状態
  const [showReactionsModal, setShowReactionsModal] = useState(false); // リアクションモーダルの表示状態
  const [selectedReactions, setSelectedReactions] = useState([]); // 選択されたリアクション
  const [selectedPost, setSelectedPost] = useState(null); // 選択された投稿

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
      setPosts(result.contacts || []); // 投稿データを設定
    } catch (err) {
      setError(err.message); // エラー処理
    } finally {
      setLoading(false); // ローディング終了
    }
  };

  // SSE接続
  useEffect(() => {
    if (!groupId) return;

    const connectSSE = () => {
      const sse = new EventSource(`${import.meta.env.VITE_API_URL}/contact/sse`, {
        withCredentials: true,
      });

      // メッセージ受信時の処理
      const onMessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("新しい投稿を受信:", data);
          setPosts((prevPosts) => [...prevPosts, data]);
        } catch (err) {
          console.error("メッセージ解析中にエラーが発生しました:", err);
        }
      };

      // エラー時の処理
      const onError = (err) => {
        console.error("SSE接続に問題が発生しました:", err);
        sse.close(); // 接続を閉じる
        setTimeout(connectSSE, 5000); // 5秒後に再接続
      };

      // イベントリスナーの登録
      sse.addEventListener("message", onMessage);
      sse.addEventListener("error", onError);

      return () => {
        // イベントリスナーの解除
        sse.removeEventListener("message", onMessage);
        sse.removeEventListener("error", onError);
        sse.close(); // 接続の終了
      };
    };

    const sse = connectSSE();

    return () => {
      sse.close();
    };
  }, [groupId]);

  // 投稿詳細とリアクションを取得
  const fetchPostDetails = async (contactId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/contact/${contactId}`
      );
      if (!response.ok) throw new Error("詳細データの取得に失敗しました。");

      const result = await response.json();
      setSelectedPost(result.contact); // 選択された投稿
      setSelectedReactions(result.reactions || []); // 投稿に関連するリアクション
      setShowReactionsModal(true); // リアクションモーダルを表示
    } catch (err) {
      alert(`エラー: ${err.message}`); // エラーハンドリング
    }
  };

  // 初回ロードまたはグループID変更時に投稿一覧を取得
  useEffect(() => {
    if (groupId) {
      fetchPosts(); // 投稿一覧を取得
    }
  }, [groupId]);

  // 新しい投稿が作成された後に投稿一覧を再取得
  const handlePostCreated = async (newPost) => {
    try {
      // 投稿が作成されたら、投稿一覧を再取得
      await fetchPosts();
    } catch (error) {
      alert(`投稿の取得に失敗しました: ${error.message}`);
    }
  };

  // 投稿編集
  const handleEditPost = async (contactId, updatedData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/contact/${contactId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData), // 編集内容を送信
        }
      );
  
      if (!response.ok) throw new Error("投稿の編集に失敗しました。");
      fetchPosts(); // 投稿一覧を再取得
    } catch (err) {
      alert(`エラー: ${err.message}`);
    }
  };

  // 投稿削除
  const handleDeletePost = async (contactId) => {
    if (!window.confirm("本当にこの投稿を削除しますか？")) return;
  
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/contact/${contactId}`,
        {
          method: "DELETE",
        }
      );
  
      if (!response.ok) throw new Error("投稿の削除に失敗しました。");
      fetchPosts(); // 投稿一覧を再取得
    } catch (err) {
      alert(`エラー: ${err.message}`);
    }
  };

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
        posts={posts} // 投稿リスト
        error={error} // エラー情報
        loading={loading} // ローディング状態
        onFetchDetails={fetchPostDetails} // 詳細取得関数
        reactions={selectedReactions} // リアクション
        onEditPost={handleEditPost} // 編集処理
        onDeletePost={handleDeletePost} // 削除処理
      />

      {/* 投稿フォームモーダル */}
      {showModal && (
        <PostFormModal
          onClose={() => setShowModal(false)} // モーダル閉じる
          groupId={groupId} // グループID
          onPostCreated={handlePostCreated} // 投稿作成後に呼ばれる関数
        />
      )}

      {/* リアクションモーダル */}
      {showReactionsModal && (
        <ReactionsModal
          reactions={selectedReactions} // リアクション
          post={selectedPost} // 投稿情報
          onClose={() => setShowReactionsModal(false)} // モーダル閉じる
        />
      )}
    </div>
  );
}

export default GroupContact;