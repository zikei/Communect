import React from "react";

function PostList({
  posts,
  error,
  loading,
  onFetchDetails,
  handleReaction,
  reactions = [], // reactionsがundefinedの場合、空配列をデフォルト値に
}) {
  const importanceClass = {
    HIGH: "post-high-importance",
    MEDIUM: "post-medium-importance",
    LOW: "post-low-importance",
    SAFE: "post-safe-importance",
  };

  if (error) return <p className="text-danger">エラー: {error}</p>;
  if (loading) return <p>読み込み中...</p>;
  if (posts.length === 0) return <p>まだ投稿がありません。</p>;

  return (
    <div className="group-contact-content px-5">
      {posts.map((post) => {
        // reactionsが空でないかを確認してからfilterメソッドを使う
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
            {/* 投稿メッセージ */}
            <p>{post.message}</p>

            {/* 確認連絡の場合のボタン */}
            {post.contactType === "CONFIRM" && (
              <button
                className="btn btn-secondary mt-2"
                onClick={() => handleReaction(post.contactId)}
              >
                確認
              </button>
            )}

            {/* 多肢連絡の場合の選択肢とリアクション表示 */}
            {post.contactType === "CHOICE" && post.choices && (
              <div className="choices-section mt-3">
                <h5>選択肢</h5>
                {post.choices.map((choice) => {
                  // この選択肢に関連するリアクションをフィルタリング
                  const choiceReactions = postReactions.filter(
                    (reaction) => reaction.choice.choiceId === choice.choiceId
                  );

                  return (
                    <div key={choice.choiceId} className="choice-item mb-3">
                      {/* 選択肢ボタン */}
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() =>
                          handleReaction(post.contactId, choice.choiceId)
                        }
                      >
                        {choice.choice}
                      </button>
                      {/* この選択肢へのリアクション一覧 */}
                      {choiceReactions.length > 0 && (
                        <ul className="reaction-list mt-2">
                          {choiceReactions.map((reaction) => (
                            <li key={reaction.reactionId}>
                              {reaction.nickName || reaction.userName} が選択
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 詳細ボタン */}
            <button
              className="btn btn-outline-info mt-2"
              onClick={() => onFetchDetails(post.contactId)}
            >
              詳細を見る
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PostList;
