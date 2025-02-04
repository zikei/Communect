import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // 修正: Pickerを@react-native-picker/pickerからインポート
import axios from "axios";
import { FontAwesome } from 'react-native-vector-icons';

const Sidebar = ({
  groups,
  expandedGroups,
  toggleGroup,
  handleGroupClick,
  sidebarOpen,
  toggleSidebar,
  error,
  setGroups, // 親コンポーネントから渡されるグループ更新関数
}) => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedParentGroup, setSelectedParentGroup] = useState("");
  const [isLoading, setIsLoading] = useState(false); // API呼び出し中フラグ
  const [apiError, setApiError] = useState(null); // エラー管理
  const [isPlusModalVisible, setIsPlusModalVisible] = useState(false);
  const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);
  const [inputText, setInputText] = useState("");

  const localUserData = [
    { userId: 1, userName: "田中", nickName: "たなか", password: "LOVELETTER", email: 'love@letter.nect'},
    { userId: 2, userName: "高橋", nickName: "たかはし", password: "LOVELETTER", email: 'love@letter.nect' },
    { userId: 3, userName: "堀江", nickName: "ほりえ", password: "LOVELETTER", email: 'love@letter.nect' },
    { userId: 4, userName: "村田", nickName: "むらた", password: "LOVELETTER", email: 'love@letter.nect' },
    { userId: 5, userName: "矢野", nickName: "やの", password: "LOVELETTER", email: 'love@letter.nect' },
    { userId: 6, userName: "水本", nickName: "みずもと", password: "LOVELETTER", email: 'love@letter.nect' },
    { userId: 7, userName: "安増", nickName: "やすます", password: "LOVELETTER", email: 'love@letter.nect' },
  ];

  const handleOpenPlusModal = () => {
    setSelectedGroupUsers(localUserData); // グループに属するユーザー情報を取得
    setIsPlusModalVisible(true);
  };

  // モーダルを閉じる
  const handleClosePlusModal = () => {
    setIsPlusModalVisible(false);
    setSelectedGroupUsers([]);
  };
  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setNewGroupName("");
    setSelectedParentGroup("");
    setApiError(null);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setInputText(""); // テキストボックスの入力をリセット
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();


    // バリデーションチェック
    if (newGroupName.trim() === "") {
      setApiError("グループ名を入力してください！");
      return;
    }
    setIsLoading(true);
    setApiError(null); // エラーリセット
  
    const newGroup = {
      groupName: newGroupName.trim(),
      aboveId: selectedParentGroup || null, // 親グループが選択されていない場合はnull
    };

  
  
    try {
      const response = await axios.post(`https://communectapi.zikeidev.com/group`, newGroup, {
          withCredentials: true,
      });

      console.log("サーバーからのレスポンス: ", response.data);

      if (response.status !== 200 && response.status !== 201) {
          throw new Error("グループの作成に失敗しました");
      }

      const createdGroup = response.data;
      // サイドバーのグループリストに新しいグループを追加
      setGroups((prevGroups) => [
        ...prevGroups,
        {
          groupName: createdGroup.groupName,
          aboveId: createdGroup.aboveId,
        },
      ]);
  
      // モーダルを閉じてフォームをリセット
      handleCloseModal();
    } catch (error) {
      setApiError(error.response?.data?.message || error.message || "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const renderParentGroups = () => (
    <Picker
      selectedValue={selectedParentGroup}
      onValueChange={(itemValue) => setSelectedParentGroup(itemValue)}
      style={styles.picker}
    >
      <Picker.Item label="親グループなし" value="" />
      {groups.map((group) => (
        <Picker.Item key={group.groupId} label={group.groupName} value={group.groupId} />
      ))}
    </Picker>
  );

  const renderGroupTree = (group, level = 0) => (
    <View key={group.groupId} style={{ paddingLeft: level * 8 }}>
      <View style={styles.groupRow}>
        {/* グループ名と＋アイコン */}
        <View style={styles.groupNameWrapper}>
          {/* プラスアイコン */}
            <TouchableOpacity
            style={styles.plusIconContainer}
            onPress={handleOpenPlusModal}
          >
            <FontAwesome name="plus" size={16} color="#333" />
          </TouchableOpacity>
          {/* グループ名 */}
          <TouchableOpacity
            onPress={() => handleGroupClick(group)}
            style={styles.groupNameContainer}
          >
            <Text style={styles.groupName} numberOfLines={1} ellipsizeMode="tail">
              {group.groupName}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ゴミ箱アイコンと展開記号 */}
        <View style={styles.iconWrapper}>
          {/*{group.groupId === group.groupId && (
            <TouchableOpacity
              onPress={() => handleDeleteGroup(group.groupId)}
              style={styles.trashIconContainer}
            >
              <FontAwesome name="trash" size={16} color="black" />
            </TouchableOpacity>
          )}*/}
          <TouchableOpacity
            onPress={() => toggleGroup(group.groupId)}
            style={styles.expandIconContainer}
          >
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

  const renderModalGroupTree = (group, level = 0) => (
    <View key={group.groupId} style={{ paddingLeft: level * 8 }}>
      <View style={styles.groupRow}>
        <View style={styles.groupNameWrapper}>
          <Text style={styles.groupName}>{group.groupName}</Text>
          <TouchableOpacity
            style={styles.plusIconContainer}
            onPress={() => handleOpenPlusModal(group)}
          >
            <FontAwesome name="plus" size={16} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );


  return (
    <View style={[styles.sidebar, sidebarOpen ? styles.open : styles.closed]}>
      <TouchableOpacity style={styles.button} onPress={handleOpenModal}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome name="user-plus" size={16} color="#fff" />
          <Text style={styles.buttonText}>グループ作成</Text>
        </View>
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

      {/* Settingボタンをグループリストの下に移動 */}
      <TouchableOpacity onPress={() => navigation.navigate('Setting')} style={styles.settingButton}>
        <FontAwesome name="cog" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.toggleIcon} onPress={toggleSidebar}>
        <FontAwesome
          name={sidebarOpen ? "angle-left" : "angle-right"}
          size={24}
          color="#fff"
        />
      </TouchableOpacity>

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

            <Text style={styles.modalTitle}>グループ作成</Text>
            {apiError && <Text style={styles.errorText}>{apiError}</Text>}

            <Text style={styles.label}>グループ名</Text>
            <TextInput
              style={styles.input}
              placeholder="グループ名"
              value={newGroupName}
              onChangeText={setNewGroupName}
            />

            <Text style={styles.label}>親グループ</Text>
            {renderParentGroups()}

            <TouchableOpacity style={styles.closeButton} onPress={handleCreateGroup}>
              <Text style={styles.closeButtonText}>作成</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* モーダル */}
      <Modal
        visible={isPlusModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClosePlusModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeIcon} onPress={handleClosePlusModal}>
              <Text style={styles.closeIconText}>×</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>グループユーザー</Text>
            <FlatList
              data={selectedGroupUsers}
              keyExtractor={(item) => item.userId.toString()}
              renderItem={({ item }) => (
                <View style={styles.userRow}>
                  <Text style={styles.userName}>
                    {item.userName} ({item.nickName})
                  </Text>
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
  sidebar: {
    position: "absolute", // 絶対配置
    left: 0,
    top: 0,
    bottom: 0,
    width: 270, // 固定幅
    backgroundColor: '#fdfdff',
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    zIndex: 10, // コンテンツの上に表示する
    transform: [{ translateX: -270 }], // 初期状態で画面外に配置
  },
  open: {
    transform: [{ translateX: 0 }], // 開いた状態で画面内に表示
  },
  closed: {
    transform: [{ translateX: -270 }], // 閉じた状態で画面外に配置
  },
  button: {
    backgroundColor: "#79f",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    right:-45,
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
    bottom: 20, // 画面下からの位置
    left: 10,   // サイドバー側の位置
    backgroundColor: "#79f", // ボタン背景色
    width: 45, // ボタンの幅
    height: 45, // ボタンの高さ
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25, // 丸い形状にする
    shadowColor: "#000", // シャドウ効果
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // Android用シャドウ
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
    paddingRight: 5, // アイコン間の余白
  },
  groupNameWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // グループ名エリアの柔軟性を確保
    marginRight: 10, // アイコンとの余白
  },
  iconWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  groupNameContainer: {
    flex: 1,
  },
  groupName: {
    fontSize: 17,
    color: "#27f",
    flexShrink: 1, // 長い名前は縮小表示
  },
  expandIconContainer: {
    paddingHorizontal: 2,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalPlusUser: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  input: {
    height: 55,
    borderColor: "#79f",
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
    marginRight: 5, // 展開記号との余白
  },
  trashIcon: {
    fontSize: 16,
    color: "#ff4d4d", // 赤色
  },
  expandIconContainer: {
    paddingHorizontal: 5,
  },
  expandIcon: {
    fontSize: 16,
    color: "#444",
  },
  plusIconContainer: {
    paddingHorizontal: 5, // アイコン間の余白
    justifyContent: "right",
    alignItems: "center",
  },
  plusIcon: {
    fontSize: 16,
 
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#f9f9ff",
    padding: 20,
    width: 300,
    borderRadius: 10,
  },
  closeButton: {
    backgroundColor: "#79f",
    width: 70,  // 横幅を調整（ほぼ正方形）
    height: 45, // 高さを統一
    borderRadius: 5, // 円形に近づける
    alignItems: "center", // 中央揃え
    justifyContent: "center", // 縦方向も中央揃え
    alignSelf: "center", // ボタンをモーダルの中央下に配置
    marginTop: 20, // モーダル内の要素と適度に間隔を空ける
  },

  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#79f",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // 必要に応じて背景色を設定
  },
  settingButton: {
    position: 'absolute',
    bottom: 20, // サイドバーの下端からの距離
    right: 20, // サイドバーの右端からの距離
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#79f', // ボタンの背景色
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Android で影を追加
    shadowColor: '#000', // iOS で影を追加
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
  userRow: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Sidebar;