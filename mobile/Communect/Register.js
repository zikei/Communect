import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !nickname || !email || !password) {
      Alert.alert('エラー', 'すべてのフィールドを入力してください。');
      return;
    }

    try {
      const response = await fetch('https://yourapi.com/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          nickname,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'アカウント登録に失敗しました。');
      }

      // サーバーからAPIキーを取得して保存
      const { apikey } = data;

      // APIキーをローカルストレージに保存
      await AsyncStorage.setItem('apiKey', apikey);

      Alert.alert('登録成功', 'アカウントが作成されました。ログインしてください。');
      navigation.replace('Login'); // ログイン画面に遷移
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('エラー', error.message);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false, // 登録画面ではヘッダー非表示
    });
  }, [navigation]);  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>アカウント登録</Text>
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
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="パスワード"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="登録" onPress={handleRegister} />
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

export default Register;
