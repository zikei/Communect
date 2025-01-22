import React, { useState } from "react";
import ReactionsModal from "./ReactionsModal";
import PostFormModal from "./PostFormModal";

function PostList({
  posts,
  error,
  loading,
  onFetchDetails,
  reactions = [],
  onEditPost,
  onDeletePost,
}) {
  const [showReactionsModal, setShowReactionsModal] = useState(false);
  const [selectedReactions, setSelectedReactions] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  const importanceClass = {
    HIGH: "post-high-importance",
    MEDIUM: "post-medium-importance",
    LOW: "post-low-importance",
    SAFE: "post-safe-importance",
  };

  if (error) return <p className="text-danger">エラー: {error}</p>;
  if (loading) return <p>読み込み中...</p>;
  if (posts.length === 0) return <p>まだ投稿がありません。</p>;

  const handleShowReactions = (reactions, choice) => {
    setSelectedReactions(reactions);
    setSelectedChoice(choice);
    setShowReactionsModal(true);
  };

  const handleReactionClick = async (contactId, choiceId = null) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + `/contact/${contactId}/reaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ choiceId }),
        }
      );

      if (response.status === 200) {
        alert("リアクションが送信されました！");
      } else {
        throw new Error("リアクション送信に失敗しました。");
      }
    } catch (err) {
      alert(`エラー: ${err.message}`);
    }
  };

  const handleOpenEditModal = (post) => {
    setEditingPost(post);
  };

  const handleEditComplete = (updatedData) => {
    onEditPost(editingPost.contactId, updatedData);
    setEditingPost(null); // 編集モーダルを閉じる
  };

  return (
    <div className="group-contact-content px-5">
      {posts.map((post, index) => {
        const postReactions = reactions.filter(
          (reaction) => reaction.contactId === post.contactId
        );

        return (
          <div
            key={`${post.contactId}-${index}`}
            className={`group-contact-post px-5 ${
              importanceClass[post.importance] || ""
            }`}
          >
            {post.importance === "LOW" && (
              <span className="badge bg-info">INFO</span>
            )}
            {post.importance === "MEDIUM" && (
              <span className="badge bg-warning">WARNING</span>
            )}
            {post.importance === "HIGH" && (
              <span className="badge bg-danger">DANGER</span>
            )}

            <p>{post.message}</p>

            {post.contactType === "CONFIRM" && (
              <button
                className="btn btn-secondary mt-2"
                onClick={() => handleReactionClick(post.contactId)}
              >
                確認
              </button>
            )}

            {post.contactType === "CHOICE" && post.choices && (
              <div className="choices-section mt-3">
                <h5>選択肢</h5>
                {post.choices.map((choice, index) => {
                  const choiceReactions = postReactions.filter(
                    (reaction) => reaction.choice.choiceId === choice.choiceId
                  );

                  return (
                    <div
                      key={`${post.contactId}-${choice.choiceId}`}
                      className="choice-item mb-3"
                    >
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() =>
                          handleReactionClick(post.contactId, choice.choiceId)
                        }
                      >
                        {choice.choice}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {(post.contactType === "CONFIRM" ||
              post.contactType === "CHOICE") && (
              <button
                className="btn btn-outline-info mt-2"
                onClick={() => onFetchDetails(post.contactId)}
              >
                詳細を確認する
              </button>
            )}
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => handleOpenEditModal(post)}
              >
                編集
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => onDeletePost(post.contactId)}
              >
                削除
              </button>
            </div>
          </div>
        );
      })}

      {showReactionsModal && (
        <ReactionsModal
          reactions={selectedReactions}
          post={{ message: selectedChoice }}
          onClose={() => setShowReactionsModal(false)}
        />
      )}

      {editingPost && (
        <PostFormModal
          onClose={() => setEditingPost(null)}
          groupId={editingPost.groupId}
          onPostCreated={handleEditComplete} // 編集結果を適用
          initialData={editingPost} // 初期データを渡す
        />
      )}
    </div>
  );
}

export default PostList;
