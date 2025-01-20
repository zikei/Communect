import React, { useState , useEffect } from "react";

function PostFormModal({ onClose, groupId, onPostCreated, initialData }) {
  const [formData, setFormData] = useState({
    message: "",
    contactType: "INFORM",
    importance: "LOW",
    choices: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        message: initialData.message,
        contactType: initialData.contactType,
        importance: initialData.importance,
        choices: Array.isArray(initialData.choices)
        ? initialData.choices.map((choice) => choice.choice)
        : [],
    });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (formData.contactType === "CHOICE" && formData.choices.length < 2) {
      alert("選択肢は2つ以上入力してください。");
      return;
    }

    const requestData = { ...formData, groupId };

    try {
      const response = await fetch( `${import.meta.env.VITE_API_URL}/contact${initialData ? `/${initialData.contactId}` : ""}`, {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

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
            {formData.choices.map((choice, index) => (
              <div key={index} className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={choice}
                  onChange={(e) =>
                    setFormData((prevData) => {
                      const updatedChoices = [...prevData.choices];
                      updatedChoices[index] = e.target.value;
                      return { ...prevData, choices: updatedChoices };
                    })
                  }
                />
                <button
                  className="btn btn-danger"
                  onClick={() =>
                    setFormData((prevData) => ({
                      ...prevData,
                      choices: prevData.choices.filter((_, i) => i !== index),
                    }))
                  }
                >
                  削除
                </button>
              </div>
            ))}
            <button
              className="btn btn-secondary"
              onClick={() =>
                setFormData((prevData) => ({
                  ...prevData,
                  choices: [...prevData.choices, ""],
                }))
              }
            >
              選択肢を追加
            </button>
          </div>
        )}
        <button className="btn btn-success mt-3" onClick={handleSubmit}>
        {initialData ? "更新" : "投稿"}
        </button>
      </div>
    </div>
  );
}

export default PostFormModal;