import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const PasswordChange = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

    try {
      const payload = { password: newPassword };
      const response = await fetch('http://api.localhost/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert('成功', 'パスワードが更新されました。');
        navigation.goBack();
      } else {
        const errorData = await response.json();
        Alert.alert('エラー', errorData.message || '更新に失敗しました。');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      Alert.alert('エラー', 'サーバーに接続できません。');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>パスワード変更</Text>
      <TextInput
        style={styles.input}
        placeholder="現在のパスワード"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
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

export default PasswordChange;
