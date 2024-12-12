import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('a');
  const [password, setPassword] = useState('a');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // アプリ起動時に保存されたログイン情報を取得
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername !== null) {
          setUsername(storedUsername);
          setIsLoggedIn(true);  // すでにログインしている状態に設定
        }
      } catch (error) {
        console.error('Error loading login information:', error);
      }
    };

    checkLoginStatus();
  }, []);

  // ログイン処理
  const handleLogin = async () => {
    if (username === '' || password === '') {
      Alert.alert('エラー', 'ユーザー名とパスワードを入力してください');
    } else {
      try {
        // ユーザー名をAsyncStorageに保存
        await AsyncStorage.setItem('username', username);
        setIsLoggedIn(true);
        Alert.alert('ログイン成功', `ようこそ、${username}さん！`);
        
        // ログイン後、Home画面に遷移
        navigation.replace('Group');
      } catch (error) {
        console.error('Error saving login information:', error);
      }
    }
  };

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('username');
      setUsername('');
      setIsLoggedIn(false);
      Alert.alert('ログアウトしました');
    } catch (error) {
      console.error('Error removing login information:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLoggedIn ? `ようこそ、${username}さん！` : 'ログイン'}</Text>

      {!isLoggedIn ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="ユーザー名"
            value={username}
            onChangeText={setUsername}
          />
          
          <TextInput
            style={styles.input}
            placeholder="パスワード"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          
          <Button title="ログイン" onPress={handleLogin} />
        </>
      ) : (
        <Button title="ログアウト" onPress={handleLogout} />
      )}
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

export default Login;

