import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const users = [
  { id: '1', name: '山田 太郎' },
  { id: '2', name: '佐藤 花子' },
  { id: '3', name: '鈴木 次郎' },
];

const DMList = ({ navigation }) => {
  const handleSelectUser = (user) => {
    navigation.navigate('ChatScreen', { userId: user.id, userName: user.name });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ダイレクトメッセージ</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userItem} onPress={() => handleSelectUser(item)}>
            <Text style={styles.userName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  userItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  userName: { fontSize: 18 },
});

export default DMList;
