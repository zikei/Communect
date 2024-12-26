import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register = ({ navigation }) => {
  const [RegisterData, setRegisterDate] = useState({
    userName: '',
    nickName: '',
    password: '',
    email: '',
  });

  const handleInputChange = (field, value) => {
    setRegisterDate((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (!RegisterData.userName || !RegisterData.nickName || !RegisterData.email || !RegisterData.password) {
      Alert.alert('エラー', 'すべてのフィールドを入力してください。');
      return;
    }

    try {
      const response = await fetch(`http://api.localhost/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(RegisterData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'アカウント登録に失敗しました。');
      }

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
        value={RegisterData.userName}
        onChangeText={(value) => handleInputChange('userName', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="ニックネーム"
        value={RegisterData.nickName}
        onChangeText={(value) => handleInputChange('nickName', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="メールアドレス"
        value={RegisterData.email}
        onChangeText={(value) => handleInputChange('email', value)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="パスワード"
        secureTextEntry
        value={RegisterData.password}
        onChangeText={(value) => handleInputChange('password', value)}
      />
      <Button title="登録" onPress={handleRegister} />
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
});

export default Register;