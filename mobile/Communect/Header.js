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
import { FontAwesome5 } from "react-native-vector-icons";
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

const Header = ({ showBackButton = false, navigation }) => {
  const [unreadCount, setUnreadCount] = useState(6); // 未読通知数
  const [modalVisible, setModalVisible] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, type: "INFO", message: "2月3、4日 校内選考", importance: "LOW", contentType: 'INFORM'},
    { id: 2, type: "WARNING", message: "モバイルのクロスプラットフォームはどれがいいか投票してね", importance: "MEDIUM", contentType: 'CHOICE' },
    { id: 3, type: "DANGER", message: "1月31日までに提出する書類を提出していない方、確認を押してください。", importance: "HIGH", contentType: 'CONFIRM' },
    { id: 4, type: "INFO", message: "今週の進捗報告を書いておいてください", importance: "LOW", contentType: 'INFORM' },
    { id: 5, type: "INFO", message: "校内選考は2月4日の12番目の発表です", importance: "LOW", contentType: 'INFORM' },
    { id: 6, type: "DANGER", message: "校内選考と卒業研究発表会は「スーツ」着用なので忘れずに！！", importance: "HIGH", contentType: 'INFORM' },
  ]);

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

  const handleConfirm = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
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
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIcon} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeIconText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>通知</Text>
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => (
                <View style={styles.notificationItem}>
                  <TouchableOpacity onPress={() => handleConfirm(item.id)} style={styles.checkButton}>
                  <FontAwesome5 name="check-square" size={24} color="#79f" solid={false} />
                  </TouchableOpacity>
                  <Text style={styles.notificationText}>{item.message}</Text>
                </View>
              )}
            />
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
    backgroundColor: "#f9f9ff",
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
    alignItems: "center", 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: "#ddd", 
    width: "90%" 
  },
  confirmButton: { 
    backgroundColor: "#007bff", 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    borderRadius: 5 
  },
  confirmButtonText: { 
    color: "white", 
    fontWeight: "bold" 
  },
  checkButton: { 
    padding: 5,
    left: -10, 
  },
  closeIcon: {
    position: "absolute",
    width: 40,  // 横幅を調整（ほぼ正方形）
    height: 40,
    top: 10,
    right: 10,
    zIndex: 1, // 他のコンテンツより前に表示
    padding: 10,
    borderRadius: 50, // 丸いボタン
    backgroundColor: "#79f", // ボタン背景の色（透明度付き）
  },
  closeIconText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Header;