import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountEdit = ({ navigation }) => {
  // 初期状態でユーザー情報をセット
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
        if (storedUsername) {
          setUsername(storedUsername);
        }
        if (storedEmail) {
          setEmail(storedEmail);
        }
      } catch (error) {
        console.error('Error loading user information:', error);
      }
    };

    loadUserInfo();
  }, []);

  // 入力のバリデーション
  const validateInput = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('エラー', '新しいパスワードと確認用パスワードが一致しません。');
      return false;
    }
    if (newPassword.length < 8) {
      Alert.alert('エラー', 'パスワードは8文字以上でなければなりません。');
      return false;
    }
    return true;
  };

  // ユーザー情報の保存
  const handleSave = async () => {
    if (validateInput()) {
      try {
        // ユーザー名、メールアドレス、パスワードの保存
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('email', email);
        if (newPassword) {
          // 新しいパスワードを保存する
          await AsyncStorage.setItem('password', newPassword);
        }

        Alert.alert('成功', 'アカウント情報が更新されました。');
        navigation.goBack(); // 変更後に前の画面に戻る
      } catch (error) {
        console.error('Error saving user information:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>アカウント編集</Text>

      {/* ユーザー名 */}
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

      {/* メールアドレス */}
      <TextInput
        style={styles.input}
        placeholder="メールアドレス"
        value={email}
        onChangeText={setEmail}
      />

      {/* 現在のパスワード */}
      <TextInput
        style={styles.input}
        placeholder="現在のパスワード"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* 新しいパスワード */}
      <TextInput
        style={styles.input}
        placeholder="新しいパスワード"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      {/* 新しいパスワード確認 */}
      <TextInput
        style={styles.input}
        placeholder="新しいパスワード（確認用）"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* 保存ボタン */}
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
