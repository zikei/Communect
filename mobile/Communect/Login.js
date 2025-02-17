import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

{/*const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true); // 初回チェック中のローディング状態

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
      setLoading(true);

      // サーバーにログインリクエストを送信
      const response = await fetch('http://api.localhost/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const apiKeyResponse = await fetch(`http://api.localhost/user/apikey`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const apiKeyData = await apiKeyResponse.json();

      if (!apiKeyResponse.ok) {
        throw new Error(apiKeyData.message || 'APIキーの取得に失敗しました。');
      }

      // サーバーからAPIキーを取得して保存
      const { apikey } = apiKeyData;

      // APIキーをローカルストレージに保存
      await AsyncStorage.setItem('apiKey', apikey);
      await AsyncStorage.setItem('username', username);

      if (!response.ok) {
        throw new Error('ログインに失敗しました');
      }

      Alert.alert('ログイン成功', `ようこそ、${username}さん！`);
      navigation.replace('Group');
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('エラー', error.message);
    } finally {
      setLoading(false);
    }
  }

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

export default Login;*/}

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const apiKey = await AsyncStorage.getItem('apiKey');
        if (apiKey) {
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
      const apiKey = `${username}_apiKey`;
      await AsyncStorage.setItem('apiKey', apiKey);
      await AsyncStorage.setItem('username', username);

      setIsLoggedIn(true);
      navigation.replace('Group');
    } catch (error) {
      console.error('Error saving login information:', error);
      Alert.alert('エラー', 'ログインに失敗しました。');
    }
  };

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
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="ユーザー名"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="パスワード"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={() => navigation.navigate('Group')}>
        <Text style={styles.buttonText}>ログイン</Text>
      </TouchableOpacity>
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
    backgroundColor: '#f9f9ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#79f',
    borderWidth: 1,
    borderRadius: 4,
    width: '100%',
    marginBottom: 15,
    paddingLeft: 10,
  },
  icon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
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
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#79f',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;