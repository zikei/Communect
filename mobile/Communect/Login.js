import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true); // 初回チェック中のローディング状態
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const apiKey = await AsyncStorage.getItem('apiKey');
        if (apiKey) {
          // APIキーが存在する場合、自動的にグループ画面に遷移
          navigation.replace('Group');
        }
      } catch (error) {
        console.error('Error checking API key:', error);
      } finally {
        setLoading(false);
      }
    };

    checkApiKey();
  }, [navigation]);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('エラー', 'ユーザー名とパスワードを入力してください');
      return;
    }

    try {
      // ダミーAPIキーを生成して保存
      const apiKey = `${username}_apiKey`;
      await AsyncStorage.setItem('apiKey', apiKey);
      await AsyncStorage.setItem('username', username);

      setIsLoggedIn(true);
      Alert.alert('ログイン成功', `ようこそ、${username}さん！`);
      navigation.replace('Group');
    } catch (error) {
      console.error('Error saving login information:', error);
      Alert.alert('エラー', 'ログインに失敗しました。');
    }
  };

  // ログアウト処理は設定画面で行う前提のため、ここには含めない

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ログイン</Text>
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

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>アカウントをお持ちでない方はこちら</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '100%',
    marginBottom: 15,
    paddingLeft: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'gray',
  },
  registerText: {
    color: 'blue',
    textAlign: 'center',
    marginTop: 15,
    textDecorationLine: 'underline',
  },
});

export default Login;

