import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Button, Alert, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

const SidebarGroup = ({ groups, expandedGroups, toggleGroup, handleGroupClick, sidebarOpen, toggleSidebar, error }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [parentGroupId, setParentGroupId] = useState(null);
  const [addedUsers, setAddedUsers] = useState([]);
  const [apiError, setApiError] = useState(null);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setGroupName("");
    setParentGroupId(null);
    setAddedUsers([]);
    setApiError(null);
  };

  const handleUserSelect = useCallback((selectedUsers) => {
    setAddedUsers(selectedUsers);
  }, []);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("エラー", "グループ名は必須です。");
      return;
    }

    const newGroup = {
      name: groupName.trim(),
      above: parentGroupId || null,
      users: addedUsers.map((user) => user.userId),
    };

    try {
      const response = await axios.post(`http://api.localhost/group`, newGroup);
      Alert.alert("成功", "グループが作成されました。再読み込みを行ってください。");
      handleCloseModal();
    } catch (err) {
      console.error("グループ作成エラー:", err);
      setApiError("グループ作成中にエラーが発生しました。");
    }
  };

  const renderParentGroups = () => (
    <Picker
      selectedValue={parentGroupId}
      onValueChange={(itemValue) => setParentGroupId(itemValue)}
      style={styles.picker}
    >
      <Picker.Item label="親グループなし" value={null} />
      {groups.map((group) => (
        <Picker.Item key={group.groupId} label={group.groupName} value={group.groupId} />
      ))}
    </Picker>
  );

  const renderGroupTree = (group, level = 0) => (
    <View key={group.groupId} style={{ paddingLeft: level * 10 }}>
      <TouchableOpacity onPress={() => handleGroupClick(group)}>
        <Text style={styles.groupName}>{group.groupName}</Text>
      </TouchableOpacity>
      {expandedGroups[group.groupId] &&
        group.children.map((child) => renderGroupTree(child, level + 1))}
    </View>
  );

  return (
    <View style={[styles.sidebar, sidebarOpen ? styles.open : styles.closed]}>
      <TouchableOpacity style={styles.button} onPress={handleOpenModal}>
        <Text style={styles.buttonText}>グループ作成</Text>
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

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>グループ作成</Text>
            {apiError && <Text style={styles.errorText}>{apiError}</Text>}
            <TextInput
              style={styles.input}
              placeholder="グループ名を入力"
              value={groupName}
              onChangeText={setGroupName}
            />
            <Text style={styles.label}>親グループ:</Text>
            <View style={styles.pickerContainer}>{renderParentGroups()}</View>
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
    height: 50,
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
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  groupName: {
    fontSize: 16,
    color: "#333",
  },
});

export default SidebarGroup;
