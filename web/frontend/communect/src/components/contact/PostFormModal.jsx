import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert, Spinner } from "react-bootstrap";

function PostFormModal({ onClose, groupId, onPostCreated, initialData }) {
  const [formData, setFormData] = useState({
    message: "",
    contactType: "INFORM",
    importance: "LOW",
    choices: ["", ""],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
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
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    if (formData.contactType === "CHOICE" && formData.choices.length < 2) {
      setError("選択肢は2つ以上入力してください。");
      setIsSubmitting(false);
      return;
    }

    let requestData = {
      message: formData.message,
      contactType: formData.contactType,
      importance: formData.importance,
      groupId,
    };

    if (formData.contactType === "CHOICE") {
      requestData.choices = formData.choices;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/contact${
          initialData ? `/${initialData.contactId}` : ""
        }`,
        {
          method: initialData ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) throw new Error("投稿に失敗しました。");
      const newPost = await response.json();

      if (!initialData) {
        // 新規投稿のみ即時反映
        onPostCreated(newPost);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? "投稿を編集" : "新規投稿"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}  {/* エラーメッセージを表示 */}
        <Form>
          <Form.Group>
            <Form.Label>メッセージ</Form.Label>
            <Form.Control
              as="textarea"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>連絡タイプ</Form.Label>
            <Form.Select name="contactType" value={formData.contactType} onChange={handleInputChange}>
              <option value="INFORM">周知連絡</option>
              <option value="CONFIRM">確認連絡</option>
              <option value="CHOICE">多肢連絡</option>
            </Form.Select>
          </Form.Group>
          {formData.contactType === "CHOICE" && (
            <Form.Group>
              <Form.Label>選択肢</Form.Label>
              {formData.choices.map((choice, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <Form.Control
                    type="text"
                    value={typeof choice === "string" ? choice : ""}
                    onChange={(e) => handleChoiceChange(index, e.target.value)}
                  />
                  {index >= 2 && (
                    <Button className="text-wrap" variant="danger" size="sm" onClick={() => removeChoice(index)}>
                      削除
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="secondary" size="sm" className="mt-2" onClick={addChoice}>
                選択肢を追加
              </Button>
            </Form.Group>
          )}
          <Form.Group>
            <Form.Label>重要度</Form.Label>
            <Form.Select name="importance" value={formData.importance} onChange={handleInputChange}>
              <option value="SAFE">最低</option>
              <option value="LOW">低</option>
              <option value="MEDIUM">中</option>
              <option value="HIGH">高</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          キャンセル
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? <Spinner as="span" animation="border" size="sm" /> : initialData ? "保存" : "投稿"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PostFormModal;