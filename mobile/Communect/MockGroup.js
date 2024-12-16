import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const MockGroup = ({ navigation }) => {
    useEffect(() => {
        navigation.setOptions({
          headerShown: false, // ログイン画面ではヘッダー非表示
        });
    }, [navigation]);

    return (
    <View style={styles.container}>
      <Text style={styles.text}>グループ画面へようこそ！</Text>
      <Button title="設定" onPress={() => navigation.navigate('Setting')} />
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
});

export default MockGroup;
