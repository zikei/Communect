import React from "react";
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Button,
} from "react-native";

const Sidebar = ({
  groups,
  expandedGroups,
  toggleGroup,
  handleGroupClick,
  sidebarOpen,
  toggleSidebar,
  error,
}) => {
  const navigation = useNavigation();
  const renderGroupTree = (group, level = 0) => (
    <View key={group.groupId} style={{ paddingLeft: level * 8 }}>
      <View style={styles.groupRow}>
        {/* グループ名 */}
        <TouchableOpacity onPress={() => handleGroupClick(group)} style={styles.groupNameContainer}>
          <Text style={styles.groupName}>{group.groupName}</Text>
        </TouchableOpacity>
  
        {/* 展開記号 */}
        <TouchableOpacity onPress={() => toggleGroup(group.groupId)} style={styles.expandIconContainer}>
          <Text style={styles.expandIcon}>
            {expandedGroups[group.groupId] ? "▼" : "▶"}
          </Text>
        </TouchableOpacity>
      </View>
  
      {/* 子グループの再帰的レンダリング */}
      {expandedGroups[group.groupId] &&
        group.children.map((child) => renderGroupTree(child, level + 1))}
    </View>
  );

  return (
    <View style={[styles.sidebar, sidebarOpen ? styles.open : styles.closed]}>
      {/* グループ作成ボタン */}
      <TouchableOpacity style={styles.button} onPress={() => alert("Create Group!")}>
        <Text style={styles.buttonText}>グループ作成</Text>
      </TouchableOpacity>

      {/* Direct Messageリンク */}
      <TouchableOpacity style={styles.link} onPress={() => alert("Direct Message!")}>
        <Text style={styles.linkText}>Direct Message</Text>
      </TouchableOpacity>

      {/* 設定リンク */}
      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Setting')}>
        <Text style={styles.linkText}>Setting</Text>
      </TouchableOpacity>

      {/* グループ一覧 */}
      <View style={styles.groupsSection}>
        <Text style={styles.sectionTitle}>Groups</Text>
        {Array.isArray(groups) && groups.length > 0 ? (
          <FlatList
            data={groups}
            renderItem={({ item }) => renderGroupTree(item)}
            keyExtractor={(item) => item.groupId}
          />
        ) : (
          <Text style={styles.errorText}>{error || "Loading..."}</Text>
        )}
      </View>

      {/* サイドバー切り替えボタン */}
      <TouchableOpacity style={styles.toggleIcon} onPress={toggleSidebar}>
        <Text style={styles.toggleText}>{sidebarOpen ? "←" : "→"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  open: {
    width: 250,
  },
  closed: {
    width: 0,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  link: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  linkText: {
    color: "#007bff",
    fontSize: 16,
  },
  groupsSection: {
    flex: 1,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
  },
  toggleIcon: {
    position: "absolute",
    bottom: 20,
    left: 10,
    backgroundColor: "#007bff",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  toggleText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  groupItem: {
    fontSize: 16,
    padding: 10,
  },


  groupRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  
  groupNameContainer: {
    flex: 0, // グループ名の幅を確保
  },
  
  groupName: {
    fontSize: 16,
    color: "#333", // 必要に応じて色を調整
  },
  
  expandIconContainer: {
    paddingHorizontal: 2, // アイコン周りの余白
  },
  
  expandIcon: {
    fontSize: 16,
    color: "#555", // 必要に応じて色を調整
  },


});

export default Sidebar;