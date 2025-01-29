import React, { useState, useEffect } from "react";

function PostFormModal({ onClose, groupId, onPostCreated, initialData }) {
  const [formData, setFormData] = useState({
    message: "",
    contactType: "INFORM",
    importance: "LOW",
    choices: ["", ""],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        message: initialData.message || "",
        contactType: initialData.contactType || "INFORM",
        importance: initialData.importance || "LOW",
        choices: Array.isArray(initialData.choices)
          ? initialData.choices.map((choiceObj) =>
              typeof choiceObj === "object" ? choiceObj.choice || "" : choiceObj
            )
          : ["", ""],
      });
    }
  }, [initialData]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChoiceChange = (index, value) => {
    setFormData((prev) => {
      const updatedChoices = [...prev.choices];
      updatedChoices[index] = value;
      return { ...prev, choices: updatedChoices };
    });
  };


  const addChoice = () => {
    setFormData((prev) => ({ ...prev, choices: [...prev.choices, ""] }));
  };

  const removeChoice = (index) => {
    if (formData.choices.length > 2) {
      const updatedChoices = formData.choices.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, choices: updatedChoices }));
    }
  };

  const handleSubmit = async () => {
    if (formData.contactType === "CHOICE" && formData.choices.length < 2) {
      alert("選択肢は2つ以上入力してください。");
      return;
    }

    const requestData = { ...formData, groupId };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/contact${initialData ? `/${initialData.contactId}` : ""}`,
        {
          method: initialData ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          withcredentials: true,
          credentials: "include",
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) throw new Error("投稿に失敗しました。");
      const newPost = await response.json();
      onPostCreated(newPost);
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "400px" }}>
        <button className="btn-close" onClick={onClose}></button>
        <h2>{initialData ? "投稿を編集" : "新規投稿"}</h2>
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
            name="contactType"
            value={formData.contactType}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="INFORM">周知連絡</option>
            <option value="CONFIRM">確認連絡</option>
            <option value="CHOICE">多肢連絡</option>
          </select>
        </div>
        {formData.contactType === "CHOICE" && (
          <div className="form-group">
            <label>選択肢</label>
            {formData.choices.map((choice, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <input
                  type="text"
                  className="form-control me-2"
                  value={typeof choice === "string" ? choice : ""}
                  onChange={(e) => handleChoiceChange(index, e.target.value)}
                />
                {index >= 2 && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removeChoice(index)}
                  >
                    削除
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary btn-sm mt-2"
              onClick={addChoice}
            >
              選択肢を追加
            </button>
          </div>
        )}
        <div className="form-group">
          <label>重要度</label>
          <select
            name="importance"
            value={formData.importance}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="SAFE">最低</option>
            <option value="LOW">低</option>
            <option value="MEDIUM">中</option>
            <option value="HIGH">高</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={handleSubmit}>
          {initialData ? "保存" : "投稿"}
        </button>
      </div>
    </div>
  );
}

export default PostFormModal;
