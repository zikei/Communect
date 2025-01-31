import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from "react-native";
import { Picker } from '@react-native-picker/picker'; // ドロップダウンリスト用
import { FontAwesome } from 'react-native-vector-icons';

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
  const [timelineData, setTimelineData] = useState([]);

  const localGroupData = [
    { groupId: "1", groupName: "LOVELETTER", aboveId: null },
    { groupId: "2", groupName: "Communect", aboveId: "1" },
    { groupId: "3", groupName: "バックエンド", aboveId: "2" },
    { groupId: "4", groupName: "電子開発学園", aboveId: null },
    { groupId: "5", groupName: "KCS", aboveId: "4" },
    { groupId: "6", groupName: "KCSK", aboveId: "5" },
    { groupId: "7", groupName: "大学併修科", aboveId: "6" },
    { groupId: "8", groupName: "R4A1", aboveId: "7" },
    { groupId: "9", groupName: "国試対策", aboveId: "6" },
    { groupId: "10", groupName: "フロントエンド", aboveId: "2" },
    { groupId: "11", groupName: "モバイル", aboveId: "2" },
  ];

  const localUserData = [
    { userId: 1, userName: "田中", nickName: "たなか", password: "LOVELETTER", email: 'love@letter.nect'},
    { userId: 2, userName: "高橋", nickName: "たかはし", password: "LOVELETTER", email: 'love@letter.nect' },
    { userId: 3, userName: "堀江", nickName: "ほりえ", password: "LOVELETTER", email: 'love@letter.nect' },
    { userId: 4, userName: "村田", nickName: "むらた", password: "LOVELETTER", email: 'love@letter.nect' },
    { userId: 5, userName: "矢野", nickName: "やの", password: "LOVELETTER", email: 'love@letter.nect' },
    { userId: 6, userName: "水本", nickName: "みずもと", password: "LOVELETTER", email: 'love@letter.nect' },
    { userId: 7, userName: "安増", nickName: "やすます", password: "LOVELETTER", email: 'love@letter.nect' },
  ];

  const localTimeline = [
    { id: 1, type: "INFO", message: "2月3、4日 校内選考", importance: "LOW", contentType: 'INFORM'},
    { id: 2, type: "WARNING", message: "モバイルのクロスプラットフォームはどれがいいか投票してね", importance: "MEDIUM", contentType: 'CHOICE' },
    { id: 3, type: "DANGER", message: "1月31日までに提出する書類を提出していない方、確認を押してください。", importance: "HIGH", contentType: 'CONFIRM' },
    { id: 4, type: "INFO", message: "今週の進捗報告を書いておいてください", importance: "LOW", contentType: 'INFORM' },
    { id: 5, type: "INFO", message: "校内選考は2月4日の12番目の発表です", importance: "LOW", contentType: 'INFORM' },
    { id: 6, type: "DANGER", message: "校内選考と卒業研究発表会は「スーツ」着用なので忘れずに！！", importance: "HIGH", contentType: 'INFORM' },
  ];

  const App = () => {
    const [groups, setGroups] = useState([]);
  
    return (
      <Sidebar
        groups={groups}
        setGroups={setGroups}
        expandedGroups={{}}
        toggleGroup={() => {}}
        handleGroupClick={() => {}}
        sidebarOpen={true}
        toggleSidebar={() => {}}
        error={null}
      />
    );
  };

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
      const timelinelist = buildHierarchy(localTimeline);
      setGroups(hierarchy);
      setTimelineData(timelinelist);
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
    if (!inputText || !selectedOption || !secondSelectedOption) {
      alert("全ての項目を入力してください！");
      return;
    }
  
    // 新しいタイムライン項目を作成
    const newTimelineItem = {
      id: (Array.isArray(timelineData) ? timelineData.length : 0) + 1,
      type: selectedOption,
      message: inputText,
      importance: secondSelectedOption,
    };
  
    // タイムラインデータを更新
    setTimelineData((prev) => [...prev, newTimelineItem]);
  
    // モーダルを閉じる
    closeModal();
  };

  const Timeline = ({ data }) => {
    const getBackgroundColor = (importance) => {
      switch (importance) {
        case "LOW":
          return "#d9f5fd";
        case "MEDIUM":
          return "#fff3cd";
        case "HIGH":
          return "#ffe5e5";
        default:
          return "#f5f5f5";
      }
    };

    const getTypeColor = (importance) => {
      switch (importance) {
        case "LOW":
          return "#1e90ff";
        case "MEDIUM":
          return "#ff8c00";
        case "HIGH":
          return "#f00";
        default:
          return "#f5f5f5";
      }
    };

    const handleEdit = (id) => {
      // 編集ロジック (モーダルを開くなど)
      console.log(`Editing post with id: ${id}`);
    };
  
    const handleDelete = (id) => {
      // 削除ロジック (確認後に投稿を削除)
      console.log(`Deleting post with id: ${id}`);
    };
  
    const handleConfirm = (id, userId) => {
      // 確認ボタンが押された時の処理
      console.log(`Post with id: ${id} confirmed by user with id: ${userId}`);
    };
  
    const handleViewDetails = (userId) => {
      // ユーザー詳細画面に遷移
      console.log(`Viewing details for user with id: ${userId}`);
    };

    const handleMultipleChoice = (choice) => {
      console.log(`Multiple choice selected: ${choice}`);
    };

    return (
      <ScrollView 
        style={styles.timelineScroll} 
        contentContainerStyle={[styles.timelineContent, { paddingBottom: 20 }]}>
      <View style={styles.timelineContainer}>
      {data.map((item) => (
        <View
          key={item.id}
          style={[styles.timelineItem, 
            { 
              backgroundColor: getBackgroundColor(item.importance),
              marginBottom: 10,
            }]}
        >
          <Text style={[styles.timelineimportance,
            { 
              color: getTypeColor(item.importance),
            }]}
          >
            {item.type}
          </Text>
          <Text style={styles.timelineMessage}>
            {item.message}
          </Text>

          {/* ボタンの配置 */}
          <View style={styles.buttonContainer}>
            {/* 確認連絡の投稿にのみ確認ボタン */}
            <View style={styles.informbottomButtons}>
              {item.contentType === "CONFIRM" && (
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => handleConfirm(item.id, item.userId)} // 確認ボタン
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome name="check-circle" size={14} color="#444" />
                    <Text style={styles.buttonText}> 確認</Text>
                  </View>
                </TouchableOpacity>
              )}  

              {/* 詳細ボタン（確認連絡の投稿のみ） */}
              {item.contentType === "CONFIRM" && (
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => handleViewDetails(item.userId)} // 詳細ボタン
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome name="eye" size={14} color="#444" />
                    <Text style={styles.buttonText}> 詳細</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
            

            {/* 多肢連絡の投稿に複数選択肢ボタン */}
            {item.contentType === "CHOICE" && (
              <View style={styles.multiChoiceContainer}>
                <TouchableOpacity
                  style={styles.multiChoiceButton}
                  onPress={() => handleMultipleChoice("Option 1")}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome name="check-circle" size={14} color="#444" />
                    <Text style={styles.buttonText}> AndroidStudio</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.multiChoiceButton}
                  onPress={() => handleMultipleChoice("Option 2")}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome name="check-circle" size={14} color="#444" />
                    <Text style={styles.buttonText}> ReactNative</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.multiChoiceButton}
                  onPress={() => handleMultipleChoice("Option 3")}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome name="check-circle" size={14} color="#444" />
                    <Text style={styles.buttonText}> Flutter</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => handleViewDetails(item.userId)} // 詳細ボタン
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome name="eye" size={14} color="#444" />
                    <Text style={styles.buttonText}> 詳細</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* 編集と削除ボタンは右下にまとめる */}
            <View style={styles.bottomButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(item.id)} // 編集ボタン
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome name="edit" size={14} color="#444" />
                  <Text style={styles.buttonText}> 編集</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)} // 削除ボタン
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome name="trash" size={14} color="#444" />
                  <Text style={styles.buttonText}> 削除</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
    </ScrollView>
    );
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
            contentContainerStyle={[styles.breadcrumbContent, { flexDirection: "row" }]}
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
            </View>
            {/* タイムライン表示 */}
            <Timeline data={localTimeline} />
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

              {/* 投稿ボタン */}
              <TouchableOpacity style={styles.closeButton} onPress={handlePostComplete}>
                 <Text style={styles.closeButtonText}>投稿</Text>
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
      <TouchableOpacity style={styles.postFloatingButton} onPress={openModal}>
        <FontAwesome name="tag" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );


} 

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    flexDirection: "row",
    backgroundColor: "#f9f9ff", 
  },
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
    backgroundColor: "#79f",
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
  postFloatingButton: {
    position: "absolute",
    bottom: 20,
    right: 10,
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "#79f",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
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
    backgroundColor: "#79f",
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
    backgroundColor: "#f9f9ff",
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
    height: 50,
    borderColor: "#79f",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  picker: {
    width: '100%',
    height: 60, // 高さを指定
    marginBottom: 0,
  },
  closeButton: {
    backgroundColor: "#79f",
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
  timelineScroll: {
    flex: 0, // 全体の高さを柔軟に
    backgroundColor: "#f9f9ff", // 背景色
    paddingHorizontal: 10, // 左右の余白
    borderRadius: 10,
  },
  timelineContent: {
    paddingVertical: 10, // 上下の余白を調整
    gap: 10, // アイテム間のスペース
  },
  timelineItem: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#aaa",
    shadowColor: "#79f",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // Androidの影
  },
  timelineimportance: {
    fontSize: 16,
    marginBottom: 10,
    textShadowColor: "#fff", // 影（縁取り）の色
    textShadowOffset: { width: 0, height: 0 }, // 影の位置
    textShadowRadius: 5, // 影のぼかし
  },
  timelineMessage: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: 0,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
  },
  informbottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '45%',
    marginRight: 'auto',
  },
  editButton: {
    backgroundColor: '#fff4b3', // 黄色
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#aaa",
  },
  deleteButton: {
    backgroundColor: '#ffb7b7', // 赤色
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#aaa",
  },
  confirmButton: {
    backgroundColor: '#eee', // 灰色
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    marginRight: 'auto',
    borderWidth: 1,
    borderColor: "#aaa",
  },
  confirmButtonText: {
    color: 'black',
  },
  detailsButton: {
    backgroundColor: '#e0ffff', // 水色
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    marginRight: 'auto',
    borderWidth: 1,
    borderColor: "#aaa",
  },
  multiChoiceContainer: {
    marginTop: 10,
    flexDirection: 'column',
    marginRight: 'auto',
  },
  multiChoiceButton: {
    backgroundColor: '#ccffe5', // 青色
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#aaa",
  },
  buttonText: {
    color: '#222',
  },
});

export default Group;
