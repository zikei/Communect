import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Setting = ({ navigation }) => {
  // モーダルの表示状態を管理する変数を useState で定義
  const [isModalVisible, setModalVisible] = useState(false);

  // ログアウト処理
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

  // アカウント編集処理
  const handleEditAccount = () => {
    navigation.navigate('AccountEdit');
  };

  // アカウント削除処理
  const handleDeleteAccount = async () => {
    try {
      const apiKey = await AsyncStorage.getItem('apiKey');

      const response = await fetch('http://api.localhost/user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('アカウント削除に失敗しました');
      }

      await AsyncStorage.removeItem('apiKey');
      await AsyncStorage.removeItem('username');

      Alert.alert('アカウント削除', 'アカウントが正常に削除されました');
      setModalVisible(false);
      navigation.replace('Login');
    } catch (error) {
      console.error(error);
      Alert.alert('エラー', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>設定</Text>

      <Button title="アカウント編集" onPress={handleEditAccount} />
      <Button title="ログアウト" onPress={handleLogout} color="red" />
      <Button title="アカウント削除" onPress={() => setModalVisible(true)} color="red" />

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>本当に削除しますか？</Text>
            <Text style={styles.modalText}>この操作は取り消せません。</Text>

            <View style={styles.buttonContainer}>
              <Button title="はい" onPress={handleDeleteAccount} />
              <Button title="いいえ" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
});

export default Setting;
