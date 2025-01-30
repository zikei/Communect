import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Button,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

const Header = ({ showBackButton = false, navigation }) => {
  const [unreadCount, setUnreadCount] = useState(3); // 未読通知数
  const [modalVisible, setModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const notificationslist = [
    { id: 1, type: "INFO", message: "2月3、4日 校内選考", importance: "LOW", contentType: 'INFORM'},
    { id: 2, type: "WARNING", message: "モバイルのクロスプラットフォームはどれがいいか投票してね", importance: "MEDIUM", contentType: 'CHOICE' },
    { id: 3, type: "DANGER", message: "1月31日までに提出する書類を提出していない方、確認を押してください。", importance: "HIGH", contentType: 'CONFIRM' },
    { id: 4, type: "DANGER", message: "", importance: "HIGH", contentType: 'INFORM' },
    { id: 5, type: "INFO", message: "", importance: "LOW", contentType: 'INFORM' },
    { id: 6, type: "DANGER", message: "", importance: "HIGH", contentType: 'INFORM' },
  ];

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };
    getPermissions();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      setNotifications(prev => [...prev, notification.request.content]);
      setUnreadCount(prev => prev + 1);
    });

    return () => subscription.remove();
  }, []);

  const handleNotificationPress = () => {
    setUnreadCount(0);
    setModalVisible(true);
  };

  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* ロゴ */}
      <Image
        source={require("./assets/こみゅねくとロゴ.png")}
        style={styles.logo}
      />

      {/* 通知ベル */}
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={handleNotificationPress}
      >
        <FontAwesome name="bell" size={24} color="#666" />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* 通知モーダル */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>通知リスト</Text>
            <FlatList
              data={notificationslist}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.notificationItem}>
                  <Text>{item.message}</Text>
                  <Button title="確認" onPress={() => alert("確認しました！")} />
                </View>
              )}
            />
            <Button title="閉じる" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingBottom: 10,
    height: 70,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  backButton: {
    position: "absolute",
    left: 10,
    bottom: 10,
    padding: 10,
  },
  logo: {
    width: 180,
    height: 65,
    resizeMode: "contain",
    backgroundColor: "#000",
    borderRadius: 8,
    position: "absolute",
    left: 10,
    bottom: 5,
  },
  notificationButton: {
    position: "absolute",
    right: 10,
    bottom: 5,
    padding: 10,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "red",
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  notificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
  },
});

export default Header;