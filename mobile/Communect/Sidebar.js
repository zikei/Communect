import React from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';

const Sidebar = ({
  groups,
  expandedGroups,
  toggleGroup,
  handleGroupClick,
  renderGroupTree,
  sidebarOpen,
  toggleSidebar,
  toggleModal,
  error,
}) => {
  return (
    <View style={[styles.sidebar, sidebarOpen ? styles.open : styles.closed]}>
      {/* グループ作成ボタン */}
      <TouchableOpacity style={styles.button} onPress={toggleModal}>
        <Text style={styles.buttonText}>グループ作成</Text>
      </TouchableOpacity>

      {/* DMリンク */}
      <TouchableOpacity
        style={styles.link}
        onPress={() => alert('DM画面に移動')}
      >
        <Text style={styles.linkText}>Direct Message</Text>
      </TouchableOpacity>

      {/* 設定リンク */}
      <TouchableOpacity
        style={styles.link}
        onPress={() => alert('設定画面に移動')}
      >
        <Text style={styles.linkText}>Settings</Text>
      </TouchableOpacity>

      {/* グループ一覧 */}
      <View style={styles.groupsSection}>
       <Text style={styles.sectionTitle}>Groups</Text>
        {groups.length > 0 ? (
          groups.map((group) => renderGroupTree(group)) // renderGroupTree を使用
        ) : (
          <Text style={styles.errorText}>{error || 'Loading...'}</Text>
        )}
      </View>


      {/* サイドバー切り替えボタン */}
      <TouchableOpacity style={styles.toggleIcon} onPress={toggleSidebar}>
        <Text style={styles.toggleText}>{sidebarOpen ? '←' : '→'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  open: {
    width: 250,
  },
  closed: {
    width: 0,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  link: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  linkText: {
    color: '#007bff',
    fontSize: 16,
  },
  groupsSection: {
    flex: 1,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
  },
  toggleIcon: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    backgroundColor: '#007bff',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  toggleText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Sidebar;
