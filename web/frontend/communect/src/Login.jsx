import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import './css/login.css';
import Granim from 'granim';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (response.ok) {
        console.log('ログイン成功:', data);

        // セッションIDなどを保存したい場合
        if (data?.sessionId) {
          localStorage.setItem('SESSIONID', data.sessionId);
        }

        // /group ページに遷移
        navigate('/group');
      } else {
        setError(data?.error || 'サーバーエラーが発生しました。');
      }
    } catch (err) {
      console.error('ログインに失敗しました:', err);
      setError('ネットワークエラーが発生しました。再試行してください。');
    }
  };
  

  return (
    <Container fluid className="vh-100 d-flex justify-content-center align-items-center position-relative">
      {/* 背景用のCanvas */}
      <canvas id="canvas-basic" className="position-absolute w-100 h-100" />

      {/* ログインフォーム */}
      <div className="card p-5" style={{ width: '100%', maxWidth: '400px', zIndex: 1 }}>
        <h2>ログイン</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>ユーザー名</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>パスワード</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            ログイン
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default Login;