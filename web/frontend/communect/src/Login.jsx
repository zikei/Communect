import React, { useEffect, useState } from 'react';
import './css/login.css';
import Granim from 'granim';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [permissions, setPermissions] = useState(null); // ダミー用パーミッション

  useEffect(() => {
    new Granim({
      element: '#canvas-basic',
      direction: 'diagonal',
      isPausedWhenNotInView: true,
      states: {
        "default-state": {
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

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // ダミー
    if (username === 'admin' && password === 'password') {
      setPermissions(['READ', 'WRITE', 'DELETE']);
      alert('管理者権限を持つユーザーとしてログインしました。');
    } else if (username === 'user' && password === 'password') {
      setPermissions(['READ']);
      alert('一般ユーザーとしてログインしました。');
    } else {
      setError('ログインに失敗しました。ユーザー名またはパスワードを確認してください。');
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      {/* 背景用のCanvas */}
      <canvas id="canvas-basic" className="position-absolute w-100 h-100" />

      {/* ログインフォーム */}
      <div className="card p-5" style={{ width: '100%', maxWidth: '400px', zIndex: 1 }}>
        <h2>ログイン</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">ユーザー名</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">パスワード</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn"><a href='/group'>ログイン</a></button>
        </form>

        {/* パーミッションのダミー表示 */}
        {permissions && (
          <div className="mt-3">
            <h5>取得した権限:</h5>
            <ul>
              {permissions.map((perm, index) => (
                <li key={index}>{perm}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
