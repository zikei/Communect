import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const AccountEdit = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');

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

  const handleSave = async () => {
    try {
      const payload = {
        userName: username || null,
        nickName: nickname || null,
        email: email || null,
      };

      const response = await fetch('http://api.localhost/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('username', data.user.userName);
        await AsyncStorage.setItem('email', data.user.email);
        Alert.alert('成功', 'アカウント情報が更新されました。');
        navigation.goBack();
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
      
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="ユーザー名"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="id-badge" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="ニックネーム"
          value={nickname}
          onChangeText={setNickname}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="メールアドレス"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>保存</Text>
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
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#79f',
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
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
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AccountEdit;