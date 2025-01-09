import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountEdit = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedEmail = await AsyncStorage.getItem('email');
        if (storedUsername) setUsername(storedUsername);
        if (storedEmail) setEmail(storedEmail);
      } catch (error) {
        console.error('Error loading user information:', error);
      }
    };
    loadUserInfo();
  }, []);

  const validateInput = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('エラー', '新しいパスワードと確認用パスワードが一致しません。');
      return false;
    }
    if (newPassword && newPassword.length < 8) {
      Alert.alert('エラー', 'パスワードは8文字以上でなければなりません。');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateInput()) return;

    const payload = {
      userName: username || null,
      nickName: nickname || null,
      email: email || null,
      password: newPassword || null,
    };

    try {
      const response = await fetch('http://api.localhost/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        // レスポンスに基づいてローカルデータを更新
        await AsyncStorage.setItem('username', data.user.userName);
        await AsyncStorage.setItem('email', data.user.email);
        Alert.alert('成功', 'アカウント情報が更新されました。');
        navigation.goBack(); // 前の画面に戻る
      } else {
        const errorData = await response.json();
        Alert.alert('エラー', errorData.message || '更新に失敗しました。');
      }
    } catch (error) {
      console.error('Error updating user information:', error);
      Alert.alert('エラー', 'サーバーに接続できません。');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>アカウント編集</Text>
      <TextInput
        style={styles.input}
        placeholder="ユーザー名"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="ニックネーム"
        value={nickname}
        onChangeText={setNickname}
      />
      <TextInput
        style={styles.input}
        placeholder="メールアドレス"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="現在のパスワード"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="新しいパスワード"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="新しいパスワード（確認用）"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="保存" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 15,
    paddingLeft: 10,
  },
});

export default AccountEdit;
