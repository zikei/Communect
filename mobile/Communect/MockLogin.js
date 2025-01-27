import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";

export default function MockLogin({ navigation, users, setCurrentUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const user = users.find(
      (u) => u.userName === username && u.password === password
    );

    if (user) {
      setCurrentUser(user); // ログインユーザー情報を設定
      Alert.alert("成功", `${user.nickName}さん、ようこそ！`);
      navigation.navigate("MockGroup"); // グループ画面に遷移
    } else {
      Alert.alert("エラー", "ユーザー名またはパスワードが正しくありません");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ログイン</Text>
      <TextInput
        style={styles.input}
        placeholder="ユーザー名"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="パスワード"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="ログイン" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate("MockRegister")}>
        <Text style={styles.linkText}>アカウントを作成</Text>
      </TouchableOpacity>
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
  linkText: { color: "blue", textAlign: "center", marginTop: 10 },
});
