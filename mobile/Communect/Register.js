import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

const Register = ({ navigation }) => {
  const [RegisterData, setRegisterData] = useState({
    userName: '',
    nickName: '',
    password: '',
    email: '',
  });

  const handleInputChange = (field, value) => {
    setRegisterData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (!RegisterData.userName || !RegisterData.nickName || !RegisterData.email || !RegisterData.password) {
      Alert.alert('エラー', 'すべてのフィールドを入力してください。');
      return;
    }

    try {
      const apiKey = `${RegisterData.userName}_apiKey`;
      await AsyncStorage.setItem('apiKey', apiKey);
      Alert.alert('登録成功', 'アカウントが作成されました。ログインしてください。');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('エラー', 'アカウント登録に失敗しました。');
    }
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>アカウント登録</Text>
      
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="ユーザー名"
          value={RegisterData.userName}
          onChangeText={(value) => handleInputChange('userName', value)}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <FontAwesome name="id-badge" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="ニックネーム"
          value={RegisterData.nickName}
          onChangeText={(value) => handleInputChange('nickName', value)}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="メールアドレス"
          value={RegisterData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          keyboardType="email-address"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="パスワード"
          secureTextEntry
          value={RegisterData.password}
          onChangeText={(value) => handleInputChange('password', value)}
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>登録</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>すでにアカウントをお持ちの方はこちら</Text>
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
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
  },
  icon: {
    color: 'gray',
  },
  loginText: {
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

export default Register;