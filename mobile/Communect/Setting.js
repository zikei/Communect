import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";

const Setting = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("apiKey");
      await AsyncStorage.removeItem("username");
      navigation.replace("Login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // アカウント編集
  const handleEditAccount = () => {
    navigation.navigate("AccountEdit");
  };

  // アカウント削除
  const handleDeleteAccount = async () => {
    try {
      const apiKey = await AsyncStorage.getItem("apiKey");

      const response = await fetch("http://api.localhost/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error("アカウント削除に失敗しました");
      }

      await AsyncStorage.removeItem("apiKey");
      await AsyncStorage.removeItem("username");

      Alert.alert("アカウント削除", "アカウントが正常に削除されました");
      setModalVisible(false);
      navigation.replace("Login");
    } catch (error) {
      console.error(error);
      Alert.alert("エラー", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>設定</Text>

      {/* アカウント編集 */}
      <TouchableOpacity style={styles.button} onPress={handleEditAccount}>
        <Icon name="user" size={20} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>アカウント編集</Text>
      </TouchableOpacity>

      {/* パスワード変更 */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("PasswordChange")}>
        <Icon name="lock" size={20} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>パスワード変更</Text>
      </TouchableOpacity>

      {/* ログアウト */}
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Icon name="sign-out" size={20} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>ログアウト</Text>
      </TouchableOpacity>

      {/* アカウント削除 */}
      <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => setModalVisible(true)}>
        <Icon name="trash" size={20} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>アカウント削除</Text>
      </TouchableOpacity>

      {/* モーダル */}
      <Modal 
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Icon name="exclamation-triangle" size={40} color="red" />
            <Text style={styles.modalTitle}>本当に削除しますか？</Text>
            <Text style={styles.modalText}>この操作は取り消せません。</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.deleteButton]} onPress={handleDeleteAccount}>
                <Text style={styles.modalButtonText}>はい</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>いいえ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// **スタイル**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9ff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#79f",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "80%",
    marginBottom: 10,
    justifyContent: "center",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
  },
  deleteButton: {
    backgroundColor: "#6c757d",
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#f9f9ff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Setting;
