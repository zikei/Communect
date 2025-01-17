import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";

const PostFormModal = ({ onClose, groupId, onPostCreated, initialData }) => {
  const [formData, setFormData] = useState({
    message: "",
    contactType: "INFORM",
    importance: "LOW",
    choices: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        message: initialData.message,
        contactType: initialData.contactType,
        importance: initialData.importance,
        choices: initialData.choices || [],
      });
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddChoice = () => {
    setFormData((prev) => ({
      ...prev,
      choices: [...prev.choices, ""],
    }));
  };

  const handleRemoveChoice = (index) => {
    setFormData((prev) => ({
      ...prev,
      choices: prev.choices.filter((_, i) => i !== index),
    }));
  };

  const handleChoiceChange = (index, value) => {
    setFormData((prev) => {
      const updatedChoices = [...prev.choices];
      updatedChoices[index] = value;
      return { ...prev, choices: updatedChoices };
    });
  };

  const handleSubmit = async () => {
    if (!formData.message.trim()) {
      Alert.alert("エラー", "メッセージを入力してください");
      return;
    }
    if (formData.contactType === "CHOICE" && formData.choices.length < 2) {
      Alert.alert("エラー", "選択肢は2つ以上必要です");
      return;
    }

    try {
      const response = await fetch(`http://api.localhost/contact${initialData ? `/${initialData.contactId}` : ""}`, {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, groupId }),
      });

      if (!response.ok) throw new Error("投稿に失敗しました");
      const newPost = await response.json();
      onPostCreated(newPost);
      onClose();
    } catch (error) {
      Alert.alert("エラー", error.message);
    }
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>{initialData ? "投稿を編集" : "新規投稿"}</Text>

        <TextInput
          style={styles.input}
          placeholder="メッセージを入力"
          value={formData.message}
          onChangeText={(value) => handleInputChange("message", value)}
        />

        <Text style={styles.label}>連絡タイプ</Text>
        <Picker
          selectedValue={formData.contactType}
          onValueChange={(value) => handleInputChange("contactType", value)}
          style={styles.picker}
        >
          <Picker.Item label="周知連絡" value="INFORM" />
          <Picker.Item label="確認連絡" value="CONFIRM" />
          <Picker.Item label="多肢連絡" value="CHOICE" />
        </Picker>

        <Text style={styles.label}>重要度</Text>
        <Picker
          selectedValue={formData.importance}
          onValueChange={(value) => handleInputChange("importance", value)}
          style={styles.picker}
        >
          <Picker.Item label="最低" value="SAFE" />
          <Picker.Item label="低" value="LOW" />
          <Picker.Item label="中" value="MEDIUM" />
          <Picker.Item label="高" value="HIGH" />
        </Picker>

        {formData.contactType === "CHOICE" && (
          <View>
            <Text style={styles.label}>選択肢</Text>
            <FlatList
              data={formData.choices}
              renderItem={({ item, index }) => (
                <View style={styles.choiceContainer}>
                  <TextInput
                    style={styles.input}
                    value={item}
                    onChangeText={(value) => handleChoiceChange(index, value)}
                  />
                  <Button title="削除" onPress={() => handleRemoveChoice(index)} color="red" />
                </View>
              )}
              keyExtractor={(_, index) => index.toString()}
            />
            <Button title="選択肢を追加" onPress={handleAddChoice} />
          </View>
        )}

        <Button title={initialData ? "更新" : "投稿"} onPress={handleSubmit} />
        <Button title="キャンセル" onPress={onClose} color="gray" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
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
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginBottom: 10,
  },
  choiceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
});

export default PostFormModal;
