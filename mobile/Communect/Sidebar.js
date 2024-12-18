import React, { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { Picker } from '@react-native-picker/picker';  // 修正: Pickerを@react-native-picker/pickerからインポート

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedParentGroup, setSelectedParentGroup] = useState(null);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const renderParentGroups = () => {
    return (
      <Picker
        selectedValue={selectedParentGroup}
        onValueChange={(itemValue) => setSelectedParentGroup(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="親グループなし" value={null} />
        {groups.map((group) => (
          <Picker.Item key={group.groupId} label={group.groupName} value={group.groupId} />
        ))}
      </Picker>
    );
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim() === "") {
      alert("グループ名を入力してください！");
      return;
    }
    alert(`新しいグループ名: ${newGroupName}\n親グループ: ${selectedParentGroup ? selectedParentGroup : "なし"}`);
    handleCloseModal();
  };

  const renderGroupTree = (group, level = 0) => (
    <View key={group.groupId} style={{ paddingLeft: level * 8 }}>
      <View style={styles.groupRow}>
        {/* グループ名 */}
        <TouchableOpacity onPress={() => handleGroupClick(group)} style={styles.groupNameContainer}>
          <Text style={styles.groupName}>{group.groupName}</Text>
        </TouchableOpacity>
  
        {/* 右側アイコンエリア */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* ゴミ箱ボタン */}
          <TouchableOpacity
            onPress={() => handleDeleteGroup(group.groupId)} // 削除関数を呼び出す
            style={styles.trashIconContainer}
          >
            <Text style={styles.trashIcon}>🗑️</Text>
          </TouchableOpacity>

  
          {/* 展開記号 */}
          <TouchableOpacity onPress={() => toggleGroup(group.groupId)} style={styles.expandIconContainer}>
            <Text style={styles.expandIcon}>
              {expandedGroups[group.groupId] ? "▼" : "▶"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {expandedGroups[group.groupId] &&
        group.children.map((child) => renderGroupTree(child, level + 1))}
    </View>
  );


  const handleDeleteGroup = (groupId) => {
    Alert.alert(
      "グループ削除", // タイトル
      "本当にこのグループを削除しますか？", // メッセージ
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "削除",
          style: "destructive",
          onPress: () => {
            // ここで削除処理を実行
            console.log(`グループID ${groupId} が削除されました`);
          },
        },
      ],
      { cancelable: true }
    );
  };
  
  
  
  

  return (
    <View style={[styles.sidebar, sidebarOpen ? styles.open : styles.closed]}>
      <TouchableOpacity style={styles.button} onPress={handleOpenModal}>
        <Text style={styles.buttonText}>グループ作成</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => alert("Direct Message!")}>
        <Text style={styles.linkText}>Direct Message</Text>
      </TouchableOpacity>

      

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


      <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
        <Text style={styles.linkText}>Setting</Text>
      </TouchableOpacity>

      
      <TouchableOpacity style={styles.toggleIcon} onPress={toggleSidebar}>
        <Text style={styles.toggleText}>{sidebarOpen ? "←" : "→"}</Text>
      </TouchableOpacity>

      {/* モーダル */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>グループ作成</Text>
            <TextInput
              style={styles.input}
              placeholder="グループ名"
              value={newGroupName}
              onChangeText={setNewGroupName}
            />
            <Text style={styles.label}>親グループ:</Text>
            <View style={[styles.pickerContainer, styles.picker]}>
              {renderParentGroups()}
            </View>

            <Button title="作成" onPress={handleCreateGroup} />
            <Button title="キャンセル" onPress={handleCloseModal} color="red" />
          </View>
        </View>
      </Modal>
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
    width: 270,
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
    paddingHorizontal: 50,
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
  groupRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  groupNameContainer: {
    flex: 0,
  },
  groupName: {
    fontSize: 16,
    color: "#333",
  },
  expandIconContainer: {
    paddingHorizontal: 2,
  },
  expandIcon: {
    fontSize: 16,
    color: "#555",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    width: 300,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 55,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  picker: {
    height: 55,
    width: "100%",
    fontSize: 16,
    lineHeight: 20,
    paddingHorizontal: 8,
    color: "#333",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  trashIconContainer: {
    paddingHorizontal: 5, // アイコン間の余白
    justifyContent: "right",
    alignItems: "center",
  },
  trashIcon: {
    fontSize: 16,
    color: "#ff4d4d", // 赤色
  },
  expandIconContainer: {
    paddingHorizontal: 0, // 展開記号周りの余白
    justifyContent: "center",
    alignItems: "center",
  },
  expandIcon: {
    fontSize: 16,
    color: "#555",
  },
  
});

export default Sidebar;
