import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";

export default function MockRegister({ navigation, setUsers }) {
  const [userName, setUserName] = useState("");
  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!userName || !nickName || !password) {
      Alert.alert("エラー", "全ての項目を入力してください");
      return;
    }

    setUsers((prev) => [
      ...prev,
      { userName, nickName, password, groups: [], contacts: [] },
    ]);
    Alert.alert("成功", "アカウントを作成しました");
    navigation.navigate("MockLogin");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>アカウント登録</Text>
      <TextInput
        style={styles.input}
        placeholder="ユーザー名"
        value={userName}
        onChangeText={setUserName}
      />
      <TextInput
        style={styles.input}
        placeholder="ニックネーム"
        value={nickName}
        onChangeText={setNickName}
      />
      <TextInput
        style={styles.input}
        placeholder="パスワード"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="登録" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
});
