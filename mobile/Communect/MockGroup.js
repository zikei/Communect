import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

const MockGroup = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerShown: false, // ヘッダーを非表示
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>グループ画面へようこそ！</Text>

      {/* 設定画面へのリンク */}
      <Button title="設定" onPress={() => navigation.navigate('Setting')} />

      {/* Direct Messageリンク */}
      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('DMList')}>
        <Text style={styles.linkText}>Direct Message</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  linkText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MockGroup;
