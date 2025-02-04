import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const ChatScreen = ({ route }) => {
  const { userName } = route.params;

  const [messages, setMessages] = useState([
    { id: '1', text: 'こんにちは！', sender: 'other' },
    { id: '2', text: 'お疲れ様です！', sender: 'me' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const newMsg = { id: Date.now().toString(), text: newMessage, sender: 'me' };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{userName}</Text>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.sender === 'me' ? styles.myMessage : styles.otherMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="メッセージを入力"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendText}>送信</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', padding: 15, backgroundColor: '#007bff', color: '#fff' },
  messageBubble: { padding: 10, margin: 5, borderRadius: 10, maxWidth: '70%' },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#dcf8c6' },
  otherMessage: { alignSelf: 'flex-start', backgroundColor: '#f1f1f1' },
  messageText: { fontSize: 16 },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ccc' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginRight: 10 },
  sendButton: { backgroundColor: '#007bff', borderRadius: 5, padding: 10 },
  sendText: { color: '#fff', fontSize: 16 },
});

export default ChatScreen;
