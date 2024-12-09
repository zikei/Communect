import React, { useState } from "react";
import "../css/groupContact.css";

function GroupContact({ groupName, hasPermission, onFormSubmit, groupId, posts = [] }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    contactType: "INFORM",
    importance: "LOW",
    choices: [],
  });

  const toggleModal = () => setShowModal(!showModal);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChoiceChange = (index, value) => {
    const updatedChoices = [...formData.choices];
    updatedChoices[index] = value;
    setFormData((prevData) => ({
      ...prevData,
      choices: updatedChoices,
    }));
  };

  const addChoiceField = () => {
    setFormData((prevData) => ({
      ...prevData,
      choices: [...prevData.choices, ""],
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
    
    try {
    const response = await fetch("/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      const result = await response.json();
      alert("投稿が成功しました！");
      toggleModal();
      onFormSubmit(result.contact); // 新規投稿をリストに追加
    } else {
      throw new Error("投稿に失敗しました。");
    }
  } catch (error) {
    alert(error.message);
  }
};

  const handleReaction = async (choiceId) => {
    try {
      const response = await fetch(`/contact/${groupId}/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choiceId }),
      });
  
      if (response.ok) {
        alert("リアクションが成功しました！");
      } else {
        throw new Error("リアクションに失敗しました。");
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
      <div className="group-contact-content px-5">
        {posts && posts.length > 0 ? (
          posts.map((post, index) => (
            <div
              key={index}
              className={`group-contact-post px-5 ${importanceClass[post.importance] || ""}`}
            >
              {post.importance === "LOW" && <span className="badge bg-info">INFO</span>}
              {post.importance === "MEDIUM" && <span className="badge bg-warning">WARNING</span>}
              {post.importance === "HIGH" && <span className="badge bg-danger">DANGER</span>}
              <p>{post.message}</p>

              {post.contactType === "CHOICE" &&
                Array.isArray(post.choices) &&
                post.choices.length > 0 && (
                  <div className="d-flex flex-wrap mt-2">
                    {post.choices.map((choice, idx) => (
                      <div key={idx} className="me-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleReaction(choice.id)}
                        >
                          {choice}
                        </button>
                        {choice.reactionCount !== undefined && (
                          <span className="ms-2 text-muted small">
                            {choice.reactionCount}件
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              {post.contactType === "CONFIRM" && (
                <div className="mt-2">
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleReaction(post.id)}
                  >
                    確認
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>まだ投稿がありません。</p>
        )}
      </div>

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
            {formData.contactType === "CHOICE" && (
              <div className="form-group">
                <label>選択肢</label>
                {formData.choices.map((choice, idx) => (
                  <input
                    key={idx}
                    type="text"
                    className="form-control mb-2"
                    value={choice}
                    onChange={(e) => handleChoiceChange(idx, e.target.value)}
                  />
                ))}
                <button className="btn btn-secondary" onClick={addChoiceField}>
                  選択肢を追加
                </button>
              </div>
            )}
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
