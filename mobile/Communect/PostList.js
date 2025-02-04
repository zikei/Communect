import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";

const PostList = ({ posts, fetchPosts, currentUserId }) => {
  // 投稿の編集処理
  const handleEdit = async (post) => {
    // 編集モーダルを表示する処理を実装
    Alert.alert("編集機能", `投稿ID: ${post.id} の編集画面を開きます。`);
    // 必要なら編集モーダルを表示し、データ更新後にfetchPostsを呼び出す
  };

  // 投稿の削除処理
  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`http://api.localhost/contact/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("投稿の削除に失敗しました。");
      }

      Alert.alert("成功", "投稿が削除されました。");
      fetchPosts(); // 投稿リストを更新
    } catch (error) {
      console.error("Error deleting post:", error);
      Alert.alert("エラー", "削除中に問題が発生しました。");
    }
  };

  // リアクション処理
  const handleReaction = async (postId, choice) => {
    try {
      const response = await fetch(`http://api.localhost/contact/${postId}/reaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ choiceId: choice }),
      });

      if (!response.ok) {
        throw new Error("リアクションの送信に失敗しました。");
      }

      Alert.alert("成功", "リアクションが送信されました。");
      fetchPosts(); // 投稿リストを更新
    } catch (error) {
      console.error("Error posting reaction:", error);
      Alert.alert("エラー", "リアクション送信中に問題が発生しました。");
    }
  };

  // 投稿リストの各アイテムの表示
  const renderItem = ({ item }) => {
    const isOwner = item.userId === currentUserId;

    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <Text style={styles.postAuthor}>{item.authorName}</Text>
          <Text style={styles.postDate}>{item.createdAt}</Text>
        </View>

        <Text style={styles.postMessage}>{item.message}</Text>
        <Text style={styles.postMeta}>
          連絡タイプ: {item.contactType} | 重要度: {item.importance}
        </Text>

        {/* 確認ボタン */}
        {item.contactType === "CONFIRM" && (
          <TouchableOpacity
            style={styles.reactionButton}
            onPress={() => handleReaction(item.id, null)}
          >
            <Text style={styles.reactionButtonText}>確認</Text>
          </TouchableOpacity>
        )}

        {/* 多肢選択ボタン */}
        {item.contactType === "CHOICE" && (
          <View style={styles.choiceContainer}>
            {item.choices.map((choice, index) => (
              <TouchableOpacity
                key={index}
                style={styles.choiceButton}
                onPress={() => handleReaction(item.id, choice.choiceId)}
              >
                <Text style={styles.choiceText}>{choice.choice}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 投稿者のみ表示する編集・削除ボタン */}
        {isOwner && (
          <View style={styles.ownerActions}>
            <Button
              title="編集"
              onPress={() => handleEdit(item)}
              color="#007bff"
            />
            <Button
              title="削除"
              onPress={() => {
                Alert.alert(
                  "投稿の削除",
                  "本当にこの投稿を削除しますか？",
                  [
                    { text: "キャンセル", style: "cancel" },
                    { text: "削除", style: "destructive", onPress: () => handleDelete(item.id) },
                  ],
                  { cancelable: true }
                );
              }}
              color="red"
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  postAuthor: {
    fontWeight: "bold",
    fontSize: 16,
  },
  postDate: {
    fontSize: 12,
    color: "gray",
  },
  postMessage: {
    fontSize: 16,
    marginBottom: 10,
  },
  postMeta: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
  reactionButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  reactionButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  choiceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  choiceButton: {
    backgroundColor: "#007bff",
    padding: 8,
    borderRadius: 5,
    margin: 5,
  },
  choiceText: {
    color: "white",
    fontWeight: "bold",
  },
  ownerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  list: {
    flex: 1,
  },
});

export default PostList;
