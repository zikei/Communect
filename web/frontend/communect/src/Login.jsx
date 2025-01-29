import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Alert, Card } from 'react-bootstrap';
import './css/login.css';
import Granim from 'granim';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
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

        if (data?.sessionId) {
          localStorage.setItem('SESSIONID', data.sessionId);
        }

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
      <canvas id="canvas-basic" className="position-absolute w-100 h-100" />
      <Card className="p-4 shadow-lg rounded" style={{ width: '100%', maxWidth: '400px', zIndex: 1 }}>
        <Card.Body>
          <h2 className="text-center mb-4">ログイン</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>ユーザー名</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ユーザー名を入力してください"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>パスワード</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力してください"
                required
              />
            </Form.Group>
            <Button variant="outline-primary" type="submit" className="w-100">
              ログイン
            </Button>
            <Button
              variant="outline-secondary"
              className="w-100 mt-3"
              onClick={() => navigate('/register')}
            >
              新規登録
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;
