import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert('エラー', 'ユーザー名とパスワードを入力してください。');
      return;
    }

    try {
      const existingUsers = JSON.parse(await AsyncStorage.getItem('users')) || {};

      if (existingUsers[username]) {
        Alert.alert('エラー', 'このユーザー名は既に登録されています。');
        return;
      }

      existingUsers[username] = password; // パスワードはセキュリティのためにハッシュ化推奨
      await AsyncStorage.setItem('users', JSON.stringify(existingUsers));

      Alert.alert('登録成功', 'アカウントが作成されました。ログインしてください。');
      navigation.replace('Login'); // ログイン画面に遷移
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('エラー', 'アカウント作成に失敗しました。');
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false, // ログイン画面ではヘッダー非表示
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
