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

const PostList = ({ posts, onEdit, onDelete, onReaction, currentUserId }) => {
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

        {item.contactType === "CONFIRM" && (
          <TouchableOpacity
            style={styles.reactionButton}
            onPress={() => onReaction(item.id, "confirm")}
          >
            <Text style={styles.reactionButtonText}>確認</Text>
          </TouchableOpacity>
        )}

        {item.contactType === "CHOICE" && (
          <View style={styles.choiceContainer}>
            {item.choices.map((choice, index) => (
              <TouchableOpacity
                key={index}
                style={styles.choiceButton}
                onPress={() => onReaction(item.id, choice)}
              >
                <Text style={styles.choiceText}>{choice}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {isOwner && (
          <View style={styles.ownerActions}>
            <Button
              title="編集"
              onPress={() => onEdit(item)}
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
                    { text: "削除", style: "destructive", onPress: () => onDelete(item.id) },
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
