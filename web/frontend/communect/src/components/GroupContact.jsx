import React, { useState, useEffect } from "react";
import "../css/groupContact.css";

function GroupContact({ groupName, hasPermission, onFormSubmit, groupId }) {
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]); // posts用のステート
  const [selectedPost, setSelectedPost] = useState(null); // 詳細表示用
  const [reactions, setReactions] = useState([]);
  const [error, setError] = useState(null); // エラーメッセージ用
  const [loading, setLoading] = useState(false); // ローディング状態

  const toggleModal = () => setShowModal(!showModal);

  /* 一覧取得 */
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // ローディング開始
      setError(null); // 前回のエラーをリセット

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/group/${groupId}/contact`
        );
        if (!response.ok) {
          const errorDetail = await response.json();
          throw new Error(
            errorDetail.message || "データの取得に失敗しました。"
          );
        }

        const result = await response.json();
        setPosts(result.contacts || []); // contactsが存在しない場合のフォールバック
      } catch (err) {
        setError(err.message); // ユーザー向けエラー表示
      } finally {
        setLoading(false); // ローディング終了
      }
    };

    if (groupId) {
      fetchPosts();
    }
  }, [groupId]);

  /* 詳細取得 */
  const fetchPostDetails = async (contactId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/contact/${contactId}`
      );
      if (!response.ok) throw new Error("詳細データの取得に失敗しました。");
      const result = await response.json();
      setSelectedPost(result.contact);
      setReactions(result.reactions || []);
    } catch (err) {
      alert(`エラー: ${err.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (formData.contactType === "CHOICE" && formData.choices.length < 2) {
      alert("選択肢は2つ以上入力してください。");
      return;
    }

    const requestData = {
      message: formData.message,
      contactType: formData.contactType,
      importance: formData.importance,
      groupId,
      choices: formData.contactType === "CHOICE" ? formData.choices : null,
    };

    /* 投稿 */
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const result = await response.json();
        alert("投稿が成功しました！");
        toggleModal();
        onFormSubmit(result); // 新規投稿をリストに追加
        setPosts((prevPosts) => [result, ...prevPosts]); // 新しい投稿を先頭に追加
      } else {
        const errorDetail = await response.json();
        throw new Error(errorDetail.message || "投稿に失敗しました。");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const importanceClass = {
    HIGH: "post-high-importance",
    MEDIUM: "post-medium-importance",
    LOW: "post-low-importance",
    SAFE: "post-safe-importance",
  };

  return (
    <div className="group-contact">
      <div className="group-contact-header">
        <h1>{groupName}</h1>
        {hasPermission && (
          <button className="btn btn-primary" onClick={toggleModal}>
            投稿
          </button>
        )}
      </div>
      {/* 投稿一覧表示 */}
      <div className="group-contact-content px-5">
        {error ? (
          <p className="text-danger">エラー: {error}</p>
        ) : posts.length > 0 ? (
          posts.map((post, index) => (
            <div
              key={index}
              className={`group-contact-post px-5 ${
                importanceClass[post.importance] || ""
              }`}
            >
              <p>{post.message}</p>
  
              {/* 確認連絡の処理 */}
              {post.contactType === "CONFIRM" && (
                <div>
                  <button
                    className="btn btn-secondary mt-2"
                    onClick={async () => {
                      try {
                        const response = await fetch(
                          `${import.meta.env.VITE_API_URL}/contact/${
                            post.contactId
                          }/reaction`,
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ choiceId: null }),
                          }
                        );
  
                        if (response.ok) {
                          alert("確認しました！");
                        } else {
                          const errorDetail = await response.json();
                          throw new Error(
                            errorDetail.message || "確認に失敗しました。"
                          );
                        }
                      } catch (err) {
                        alert(`エラー: ${err.message}`);
                      }
                    }}
                  >
                    確認
                  </button>
                  {/* リアクション表示 */}
                  {post.reactions && post.reactions.length > 0 && (
                    <ul className="mt-2">
                      {post.reactions.map((reaction) => (
                        <li key={reaction.reactionId}>
                          {reaction.nickName} ({reaction.userName})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
  
              {/* 多肢連絡の処理 */}
              {post.contactType === "CHOICE" &&
                Array.isArray(post.choices) &&
                post.choices.length > 0 && (
                  <div className="d-flex flex-wrap mt-2">
                    {post.choices.map((choice, idx) => (
                      <div key={idx} className="me-3 mb-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={async () => {
                            try {
                              const response = await fetch(
                                `${import.meta.env.VITE_API_URL}/contact/${
                                  post.contactId
                                }/reaction`,
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    choiceId: choice.choiceId,
                                  }),
                                }
                              );
  
                              if (response.ok) {
                                alert(`「${choice.choice}」を選択しました！`);
                                const updatedReactions = await response.json();
                                setPosts((prevPosts) =>
                                  prevPosts.map((p) =>
                                    p.contactId === post.contactId
                                      ? { ...p, reactions: updatedReactions }
                                      : p
                                  )
                                );
                              } else {
                                const errorDetail = await response.json();
                                throw new Error(
                                  errorDetail.message || "選択に失敗しました。"
                                );
                              }
                            } catch (err) {
                              alert(`エラー: ${err.message}`);
                            }
                          }}
                        >
                          {choice.choice}
                        </button>
                        {/* 選択肢ごとのリアクション件数 */}
                        {post.reactions && (
                          <span className="ms-2 text-muted small">
                            {
                              post.reactions.filter(
                                (reaction) =>
                                  reaction.choice &&
                                  reaction.choice.choiceId === choice.choiceId
                              ).length
                            }{" "}
                            件
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))
        ) : (
          <p>まだ投稿がありません。</p>
        )}
      </div>
      {/* 投稿フォームモーダル */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="btn-close" onClick={toggleModal}></button>
            <h2>投稿フォーム</h2>
            <div className="form-group">
              <label>メッセージ</label>
              <textarea
                className="form-control"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>連絡タイプ</label>
              <select
                className="form-control"
                name="contactType"
                value={formData.contactType}
                onChange={handleInputChange}
              >
                <option value="INFORM">周知連絡</option>
                <option value="CONFIRM">確認連絡</option>
                <option value="CHOICE">多肢連絡</option>
              </select>
            </div>
            <div className="form-group">
              <label>重要度</label>
              <select
                className="form-control"
                name="importance"
                value={formData.importance}
                onChange={handleInputChange}
              >
                <option value="LOW">低</option>
                <option value="MEDIUM">中</option>
                <option value="HIGH">高</option>
                <option value="SAFE">最低</option>
              </select>
            </div>
            <button className="btn btn-success" onClick={handleSubmit}>
              投稿
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
}

export default GroupContact;
