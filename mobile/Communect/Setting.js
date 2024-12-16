import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Setting = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('apiKey');
      await AsyncStorage.removeItem('username');
      Alert.alert('ログアウトしました');
      navigation.replace('Login'); // ログイン画面に遷移
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleEditAccount = () => {
    navigation.navigate('AccountEdit');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>設定</Text>
      <Button title="アカウント編集" onPress={handleEditAccount} />
      <Button title="ログアウト" onPress={handleLogout} color="red" />
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
});

export default Setting;
