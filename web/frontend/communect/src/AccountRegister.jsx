import React, { useState } from 'react';
import axios from 'axios';
import './css/register.css';

const AccountRegister = () => {
    const [formData, setFormData] = useState({
        userName: '',
        nickName: '',
        password: '',
        email: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(import.meta.env.VITE_API_URL + "/user", formData);
            console.log('登録成功:', response.data);
        } catch (error) {
            console.error('登録失敗:', error);
        }
    };

    return (
        <div className="register-container">
            <h1 className="title">新規登録</h1>
            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                    <label className="form-label">ユーザーネーム</label>
                    <input
                        type="text"
                        name="userName"
                        value={formData.username}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">ニックネーム</label>
                    <input
                        type="text"
                        name="nickName"
                        value={formData.nickname}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                <div className="form-group">
                    <label className="form-label">パスワード</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>
                </div>
                <div className="form-group">
                    <label className="form-label">メールアドレス</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                        required
                    />
                </div>
                <button type="submit" className="register-button">登録</button>
            </form>
        </div>
    );
};

export default AccountRegister;
