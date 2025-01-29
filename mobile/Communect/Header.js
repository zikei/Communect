import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const Header = ({ showBackButton = false }) => {
  const [unreadCount, setUnreadCount] = useState(3); // 未読通知数

  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
      )}
      {/* ロゴ */}
      <Image source={require("./assets/こみゅねくとロゴ.png")} style={styles.logo} />

      {/* 通知ベル */}
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={() => setUnreadCount(0)} // クリックで通知をクリア
      >
        <FontAwesome name="bell" size={24} color="#666" />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end", // ロゴとベルマークを下に寄せる
    backgroundColor: "#000", // 背景色を黒に変更
    paddingHorizontal: 16,
    paddingBottom: 10, // 下に少し余白を作る
    height: 70, // ヘッダーの高さを調整
    elevation: 4, // Android用の影
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  backButton: {
    position: "absolute",
    left: 10,
    bottom: 10, // 下に寄せる
    padding: 10,
  },
  logo: {
    width: 180,
    height: 65,
    resizeMode: "contain",
    backgroundColor: "#000", // 背景を白にしてロゴを見やすく
    borderRadius: 8,
    position: "absolute",
    left: 10, // 左に寄せる
    bottom: 5, // 下に寄せる
  },
  notificationButton: {
    position: "absolute",
    right: 10,
    bottom: 5, // 下に寄せる
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
});

export default Header;
