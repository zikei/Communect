import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from "react-native";
import { Picker } from '@react-native-picker/picker'; // ドロップダウンリスト用

function Group() {
  const [groups, setGroups] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [currentGroup, setCurrentGroup] = useState(null);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // モーダルの表示/非表示管理
  const [inputText, setInputText] = useState(""); // テキストボックスの入力管理
  const [selectedOption, setSelectedOption] = useState(""); // ドロップダウンリストの選択管理
  const [secondSelectedOption, setSecondSelectedOption] = useState(""); // 2つ目のドロップダウンリストの選択管理
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const localGroupData = [
    { groupId: "1", groupName: "初星学園", aboveId: null },
    { groupId: "2", groupName: "専門大学", aboveId: "1" },
    { groupId: "3", groupName: "プロデューサー科", aboveId: "2" },
    { groupId: "4", groupName: "電子開発学園", aboveId: null },
    { groupId: "5", groupName: "KCS", aboveId: "4" },
    { groupId: "6", groupName: "KCSK", aboveId: "5" },
    { groupId: "7", groupName: "大学併修科", aboveId: "6" },
    { groupId: "8", groupName: "R4A1", aboveId: "7" },
    { groupId: "9", groupName: "国試対策", aboveId: "6" },
  ];

  const buildHierarchy = (groups) => {
    const groupMap = new Map();
    const roots = [];

    groups.forEach((group) => {
      groupMap.set(group.groupId, { ...group, children: [] });
    });

    groups.forEach((group) => {
      if (group.aboveId) {
        groupMap.get(group.aboveId)?.children.push(groupMap.get(group.groupId));
      } else {
        roots.push(groupMap.get(group.groupId));
      }
    });

    return roots;
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups((prevState) => ({
      ...prevState,
      [groupId]: !prevState[groupId],
    }));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleGroupClick = (group) => {
    setCurrentGroup(group);
    setSelectedGroupId(group);
    setSidebarOpen(false); // グループがクリックされた時にサイドバーを閉じる
  };

  const getBreadcrumb = (groupId) => {
    const breadcrumbs = [];
    let current = localGroupData.find((group) => group.groupId === groupId);

    while (current) {
      breadcrumbs.unshift(current);
      current = localGroupData.find((group) => group.groupId === current.aboveId);
    }

    return breadcrumbs;
  };

  useEffect(() => {
    try {
      const hierarchy = buildHierarchy(localGroupData);
      setGroups(hierarchy);
    } catch (err) {
      console.error("グループの初期化中にエラーが発生しました:", err);
      setError("グループの読み込みに失敗しました。");
    }
  }, []);

  const breadcrumbs = currentGroup ? getBreadcrumb(currentGroup.groupId) : [];

  // モーダルを開く関数
  const openModal = () => {
    setIsModalVisible(true);
  };

  // モーダルを閉じる関数
  const closeModal = () => {
    setIsModalVisible(false);
    setInputText(""); // テキストボックスの入力をリセット
    setSelectedOption(""); // ドロップダウンリストの選択をリセット
  };

  const handlePostComplete = () => {
    console.log("投稿完了");

    // モーダルを閉じる
    closeModal();
  };



  return (
    <View style={styles.container}>
      {sidebarOpen && (
        <Sidebar
          groups={groups}
          expandedGroups={expandedGroups}
          toggleGroup={toggleGroup}
          handleGroupClick={handleGroupClick}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          error={error}
        />
      )}

      <View style={styles.mainContent}>
        {breadcrumbs.length > 0 && (
          <ScrollView
            horizontal
            style={styles.breadcrumbContainer}
            contentContainerStyle={styles.breadcrumbContent}
          >
            {breadcrumbs.map((group, index) => (
              <TouchableOpacity
                key={group.groupId}
                onPress={() => handleGroupClick(group)} // パンくずリストをクリックした時にもサイドバーを閉じる
              >
                <Text style={styles.breadcrumb}>
                  {group.groupName}
                  {index < breadcrumbs.length - 1 && " > "}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {currentGroup ? (
          <View>
            <View style={styles.groupHeader}>
              {/* グループ名 */}
              <Text style={styles.groupDetail} numberOfLines={1}>
                <Text style={styles.label}></Text> {currentGroup.groupName}
              </Text>

              {/* 投稿ボタン */}
              <TouchableOpacity
                style={styles.postButton}
                onPress={openModal} // モーダルを開く
              >
                <Text style={styles.postButtonText}>投稿</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={styles.placeholderText}>
            {sidebarOpen ? "" : "グループが選択されていません。"}
          </Text>
        )}

        {/* モーダル */}
        <Modal
          visible={isModalVisible}
          transparent={true}
         animationType="fade"
         onRequestClose={closeModal} // モーダル外をクリックすると閉じる
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              {/* × ボタン */}
              <TouchableOpacity style={styles.closeIcon} onPress={closeModal}>
                 <Text style={styles.closeIconText}>×</Text>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>投稿内容</Text>
              <Text style={styles.pickerLabel}>メッセージ</Text>
      
              {/* テキストボックス */}
              <TextInput
                 style={styles.inputText}
                 value={inputText}
                 onChangeText={setInputText} // テキストボックスの内容を更新
                 placeholder="投稿内容を入力してください"
              />

              {/* 最初のドロップダウンリスト */}
              <Text style={styles.pickerLabel}>連絡タイプ</Text>
              <Picker
                 selectedValue={selectedOption}
                 onValueChange={(itemValue) => setSelectedOption(itemValue)} // ドロップダウンリストの選択を更新
                 style={styles.picker} // スタイルを追加
               >
                 <Picker.Item label="周知連絡" value="INFORM" />
                 <Picker.Item label="確認連絡" value="CONFIRM" />
                 <Picker.Item label="多岐連絡" value="CHOICE" />
               </Picker>

               {/* 2つ目のドロップダウンリスト */}
               <Text style={styles.pickerLabel}>重要度</Text>
               <Picker
                  selectedValue={secondSelectedOption}
                 onValueChange={(itemValue) => setSecondSelectedOption(itemValue)}
                 style={styles.picker}
               >
                 <Picker.Item label="最低" value="SAFE" />
                 <Picker.Item label="低" value="LOW" />
                 <Picker.Item label="中" value="MEDIUM" />
                 <Picker.Item label="高" value="HIGH" />
               </Picker>

              {/* 投稿完了ボタン */}
              <TouchableOpacity style={styles.closeButton} onPress={handlePostComplete}>
                 <Text style={styles.closeButtonText}>投稿完了</Text>
               </TouchableOpacity>
              </View>
           </View>
        </Modal>
      </View>

      {!sidebarOpen && (
        <TouchableOpacity style={styles.sidebarToggleButton} onPress={toggleSidebar}>
          <Text style={styles.sidebarToggleButtonText}>☰</Text>
        </TouchableOpacity>
      )}
    </View>
  );


} 

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row" },
  mainContent: { flex: 1, padding: 20 },
  breadcrumbContainer: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    paddingHorizontal: 5,
    marginVertical: 5,
    maxHeight: 40,
  },
  breadcrumbContent: {
    alignItems: "center",
  },
  breadcrumb: {
    fontSize: 16,
    color: "#007bff",
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  placeholderText: { fontSize: 18, color: "gray" },
  groupDetail: { fontSize: 18, marginVertical: 5 },
  label: { fontWeight: "bold" },
  sidebarToggleButton: {
    position: "absolute",
    bottom: 20,
    left: 10,
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  sidebarToggleButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold"
  },
  groupHeader: {
    flexDirection: "row", // 横並び
    alignItems: "center", // 垂直方向に中央揃え
    justifyContent: "space-between", // 名前とボタンを端に配置
    width: "100%", // コンテナ幅を画面幅に収める
    overflow: "hidden", // 子要素がはみ出さないようにする
    marginBottom: 10,
  },
  postButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    maxWidth: 80, // ボタンが大きすぎないようにする
  },
  postButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  inputText: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  closeButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  picker: {
    width: '100%',
    height: 60, // 高さを指定
    marginBottom: 0,
  },
  closeButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  pickerLabel: {
    fontSize: 17,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1, // 他のコンテンツより前に表示
    padding: 10,
    borderRadius: 50, // 丸いボタン
    backgroundColor: "rgba(0, 0, 0, 0.1)", // ボタン背景の色（透明度付き）
  },
  
  closeIconText: {
    fontSize: 24,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },

});

export default Group;
