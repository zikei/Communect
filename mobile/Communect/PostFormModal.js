import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Picker, Alert } from 'react-native';

const PostFormModal = ({ groupId, onClose, onPostCreated }) => {
  const [message, setMessage] = useState('');
  const [contactType, setContactType] = useState('INFORM'); // デフォルト: 周知連絡
  const [importance, setImportance] = useState('SAFE'); // デフォルト: 最低
  const [choices, setChoices] = useState(['']); // 多肢連絡用選択肢

  const handleAddChoice = () => {
    setChoices([...choices, '']);
  };

  const handleRemoveChoice = (index) => {
    setChoices(choices.filter((_, i) => i !== index));
  };

  const handleChoiceChange = (text, index) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = text;
    setChoices(updatedChoices);
  };

  const handlePostSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('エラー', 'メッセージを入力してください。');
      return;
    }

    if (contactType === 'CHOICE' && choices.length < 2) {
      Alert.alert('エラー', '多肢連絡には少なくとも2つの選択肢が必要です。');
      return;
    }

    try {
      const response = await fetch('http://api.localhost/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          contactType,
          importance,
          groupId,
          choices: contactType === 'CHOICE' ? choices : null,
        }),
      });

      if (!response.ok) {
        throw new Error('投稿に失敗しました。');
      }

      const data = await response.json();
      Alert.alert('成功', '投稿が完了しました。');
      onPostCreated(data.contact); // 新しい投稿データをリストに追加
      onClose(); // モーダルを閉じる
    } catch (error) {
      console.error('Error posting contact:', error);
      Alert.alert('エラー', '投稿中に問題が発生しました。');
    }
  };

  return (
    <View style={styles.modalContainer}>
      <Text style={styles.title}>新しい投稿</Text>

      <TextInput
        style={styles.input}
        placeholder="メッセージを入力"
        value={message}
        onChangeText={setMessage}
      />

      <Text>連絡タイプ:</Text>
      <Picker
        selectedValue={contactType}
        onValueChange={(value) => setContactType(value)}
        style={styles.picker}
      >
        <Picker.Item label="周知連絡" value="INFORM" />
        <Picker.Item label="確認連絡" value="CONFIRM" />
        <Picker.Item label="多肢連絡" value="CHOICE" />
      </Picker>

      <Text>重要度:</Text>
      <Picker
        selectedValue={importance}
        onValueChange={(value) => setImportance(value)}
        style={styles.picker}
      >
        <Picker.Item label="最低" value="SAFE" />
        <Picker.Item label="低" value="LOW" />
        <Picker.Item label="中" value="MEDIUM" />
        <Picker.Item label="高" value="HIGH" />
      </Picker>

      {contactType === 'CHOICE' && (
        <View>
          <Text>選択肢:</Text>
          {choices.map((choice, index) => (
            <View key={index} style={styles.choiceContainer}>
              <TextInput
                style={styles.choiceInput}
                placeholder={`選択肢 ${index + 1}`}
                value={choice}
                onChangeText={(text) => handleChoiceChange(text, index)}
              />
              <Button
                title="削除"
                onPress={() => handleRemoveChoice(index)}
                color="red"
              />
            </View>
          ))}
          <Button title="選択肢を追加" onPress={handleAddChoice} />
        </View>
      )}

      <Button title="投稿する" onPress={handlePostSubmit} />
      <Button title="キャンセル" onPress={onClose} color="gray" />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  choiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  choiceInput: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
});

export default PostFormModal;
