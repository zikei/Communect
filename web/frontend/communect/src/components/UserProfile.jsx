import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Card, Spinner, Modal, Row, Col } from "react-bootstrap";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    nickName: "",
    email: "",
    password: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/user/login", {
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data.user);
        setFormData({
          userName: response.data.user.userName || "",
          nickName: response.data.user.nickName || "",
          email: response.data.user.email || "",
          password: "",
        });
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatedData = {
      userName: formData.userName || null, // 空文字列なら null を送信
      nickName: formData.nickName || null,
      email: formData.email || null,
      password: formData.password || null,
    };

    axios
      .put(import.meta.env.VITE_API_URL + "/user", updatedData, {
        credential: "include",
        withCredentials: true,
      })
      .then(() => {
        alert("アカウント情報が更新されました！");
        setEditMode(false);
        setFormData((prev) => ({ ...prev, password: "" })); // パスワードはリセット
      })
      .catch((error) => console.error("Error updating user data:", error));
  };

  const handleDelete = () => {
    if (window.confirm("本当に退会しますか？")) {
      axios
        .delete(import.meta.env.VITE_API_URL + "/user", {
          credential: "include",
          withCredentials: true,
        })
        .then(() => {
          alert("アカウントが削除されました。");
          setShowDeleteModal(false);
        })
        .catch((error) => console.error("Error deleting account:", error));
    }
  };

  if (!user)
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p>Loading...</p>
      </div>
    );

  return (
    <Card className="user-profile-card shadow my-4 mx-4">
      <Card.Header className="bg-primary text-white">
        <h3>アカウント情報</h3>
      </Card.Header>
      <Card.Body>
        {editMode ? (
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="userName">
                  <Form.Label>ユーザー名</Form.Label>
                  <Form.Control
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    placeholder="ユーザー名を入力"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="nickName">
                  <Form.Label>表示名</Form.Label>
                  <Form.Control
                    type="text"
                    name="nickName"
                    value={formData.nickName}
                    onChange={handleChange}
                    placeholder="表示名を入力"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>メールアドレス</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="メールアドレスを入力"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>新しいパスワード</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="新しいパスワードを入力"
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="success" className="me-2" onClick={handleSave}>
                保存
              </Button>
              <Button variant="secondary" onClick={() => setEditMode(false)}>
                キャンセル
              </Button>
            </div>
          </Form>
        ) : (
          <div>
            <p>
              <strong>ユーザー名:</strong> {user.userName}
            </p>
            <p>
              <strong>表示名:</strong> {user.nickName}
            </p>
            <p>
              <strong>メールアドレス:</strong> {user.email}
            </p>
            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                className="me-2"
                onClick={() => setEditMode(true)}
              >
                編集
              </Button>
              <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                退会
              </Button>
            </div>
          </div>
        )}
      </Card.Body>

      {/* 削除確認モーダル */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>アカウント削除</Modal.Title>
        </Modal.Header>
        <Modal.Body>本当に退会しますか？この操作は取り消せません。</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            キャンセル
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            削除
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}

export default UserProfile;
