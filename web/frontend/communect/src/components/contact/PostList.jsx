import React, { useState } from "react";
import ReactionsModal from "./ReactionsModal";

function PostList({
  posts,
  error,
  loading,
  onFetchDetails,
  reactions = [],
}) {
  const [showReactionsModal, setShowReactionsModal] = useState(false);
  const [selectedReactions, setSelectedReactions] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState(null);

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
      const response = await fetch(import.meta.env.VITE_API_URL +`/contact/${contactId}/reaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ choiceId }),
      });

      if (response.status === 200) {
        alert("リアクションが送信されました！");
      } else {
        throw new Error("リアクション送信に失敗しました。");
      }
    } catch (err) {
      alert(`エラー: ${err.message}`);
    }
  };

  return (
    <div className="group-contact-content px-5">
      {posts.map((post) => {
        const postReactions = reactions.filter(
          (reaction) => reaction.contactId === post.contactId
        );

        return (
          <div
            key={post.contactId}
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
                {post.choices.map((choice) => {
                  const choiceReactions = postReactions.filter(
                    (reaction) => reaction.choice.choiceId === choice.choiceId
                  );

                  return (
                    <div key={choice.choiceId} className="choice-item mb-3">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() =>
                          handleReactionClick(post.contactId, choice.choiceId)
                        }
                      >
                        {choice.choice}
                      </button>

                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() =>
                          handleShowReactions(choiceReactions, choice.choice)
                        }
                      >
                        リアクションを見る ({choiceReactions.length})
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {(post.contactType === "CONFIRM" || post.contactType === "CHOICE") && (
              <button
                className="btn btn-outline-info mt-2"
                onClick={() => onFetchDetails(post.contactId)}
              >
                詳細を確認する
              </button>
            )}
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
    </div>
  );
}

export default PostList;
