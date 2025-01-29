import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Granim from 'granim';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './css/accountRegister.css';

const AccountRegister = () => {
  const [formData, setFormData] = useState({
    userName: '',
    nickName: '',
    password: '',
    email: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    // 背景アニメーションの初期化
    new Granim({
      element: '#canvas-basic',
      direction: 'diagonal',
      isPausedWhenNotInView: true,
      states: {
        'default-state': {
          gradients: [
            ['#FF9966', '#FF5E62'],
            ['#00F260', '#0575E6'],
            ['#e1eec3', '#f05053'],
          ],
          transitionSpeed: 2400,
        },
      },
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + '/user', formData, {
        withCredentials: true
      });
      console.log('登録成功:', response.data);
      navigate('/login');
    } catch (error) {
      if (error.response) {
        console.error('登録失敗:', error.response.data);
        alert(`登録エラー: ${error.response.data.message || '不明なエラー'}`);
      } else if (error.request) {
        console.error('サーバーが応答しません:', error.request);
        alert('サーバーが応答しません。ネットワークを確認してください。');
      } else {
        console.error('エラーが発生しました:', error.message);
        alert(`エラー: ${error.message}`);
      }
    }
  };

  return (
    <Container
      fluid
      className="vh-100 d-flex justify-content-center align-items-center position-relative"
    >
      <canvas id="canvas-basic" className="position-absolute w-100 h-100" />
      <Card className="p-4" style={{ width: '100%', maxWidth: '500px', zIndex: 1 }}>
        <h2 className="text-center mb-4">新規登録</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="userName">
            <Form.Label>ユーザー名</Form.Label>
            <Form.Control
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="nickName">
            <Form.Label>ニックネーム</Form.Label>
            <Form.Control
              type="text"
              name="nickName"
              value={formData.nickName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>パスワード</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>メールアドレス</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            登録
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default AccountRegister;