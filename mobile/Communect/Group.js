import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

function Group() {
  const [groups, setGroups] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [currentGroup, setCurrentGroup] = useState(null);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedParentId, setSelectedParentId] = useState(null);

  const localGroupData = [
    { groupId: "1", groupName: "初星学園", aboveId: null },
    { groupId: "2", groupName: "専門大学", aboveId: "1" },
    { groupId: "3", groupName: "プロデューサー科", aboveId: "2" },
    { groupId: "4", groupName: "電子開発学園", aboveId: null },
    { groupId: "5", groupName: "KCS", aboveId: "4" },
    { groupId: "6", groupName: "KCSK", aboveId: "5" },
    { groupId: "7", groupName: "大学併修科", aboveId: "6" },
    { groupId: "8", groupName: "R4A1", aboveId: "7" },
    { groupId: "9", groupName: "国試対策", aboveId: "6" },
  ];

  const buildHierarchy = (groups) => {
    const groupMap = new Map();
    const roots = [];

    groups.forEach((group) => {
      groupMap.set(group.groupId, { ...group, children: [] });
    });

    groups.forEach((group) => {
      if (group.aboveId) {
        groupMap.get(group.aboveId)?.children.push(groupMap.get(group.groupId));
      } else {
        roots.push(groupMap.get(group.groupId));
      }
    });

    return roots;
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups((prevState) => ({
      ...prevState,
      [groupId]: !prevState[groupId],
    }));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleGroupClick = (group) => {
    setCurrentGroup(group);
    setSidebarOpen(false); // グループがクリックされた時にサイドバーを閉じる
  };

  const getBreadcrumb = (groupId) => {
    const breadcrumbs = [];
    let current = localGroupData.find((group) => group.groupId === groupId);

    while (current) {
      breadcrumbs.unshift(current);
      current = localGroupData.find((group) => group.groupId === current.aboveId);
    }

    return breadcrumbs;
  };

  useEffect(() => {
    try {
      const hierarchy = buildHierarchy(localGroupData);
      setGroups(hierarchy);
    } catch (err) {
      console.error("グループの初期化中にエラーが発生しました:", err);
      setError("グループの読み込みに失敗しました。");
    }
  }, []);

  const breadcrumbs = currentGroup ? getBreadcrumb(currentGroup.groupId) : [];

  return (
    <View style={styles.container}>
      {sidebarOpen && (
        <Sidebar
          groups={groups}
          expandedGroups={expandedGroups}
          toggleGroup={toggleGroup}
          handleGroupClick={handleGroupClick}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          error={error}
        />
      )}

      <View
        style={[
          styles.mainContent,
          { marginLeft: sidebarOpen ? 250 : 0 },
        ]}
      >
        {breadcrumbs.length > 0 && (
          <ScrollView
            horizontal
            style={styles.breadcrumbContainer}
            contentContainerStyle={styles.breadcrumbContent}
          >
            {breadcrumbs.map((group, index) => (
              <TouchableOpacity
                key={group.groupId}
                onPress={() => handleGroupClick(group)} // パンくずリストをクリックした時にもサイドバーを閉じる
              >
                <Text style={styles.breadcrumb}>
                  {group.groupName}
                  {index < breadcrumbs.length - 1 && " > "}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {currentGroup ? (
          <View>
            <Text style={styles.groupDetail}>
              <Text style={styles.label}>グループ名:</Text> {currentGroup.groupName}
            </Text>
            <Text style={styles.groupDetail}>
              <Text style={styles.label}>グループID:</Text> {currentGroup.groupId}
            </Text>
          </View>
        ) : (
          <Text style={styles.placeholderText}>
            {sidebarOpen ? "サイドバーからグループを選択してください。" : "グループが選択されていません。"}
          </Text>
        )}
      </View>

      {!sidebarOpen && (
        <TouchableOpacity style={styles.sidebarToggleButton} onPress={toggleSidebar}>
          <Text style={styles.sidebarToggleButtonText}>☰</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row" },
  mainContent: { flex: 1, padding: 20 },
  breadcrumbContainer: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    paddingHorizontal: 5,
    marginVertical: 5,
    maxHeight: 40,
  },
  breadcrumbContent: {
    alignItems: "center",
  },
  breadcrumb: {
    fontSize: 16,
    color: "#007bff",
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  placeholderText: { fontSize: 18, color: "gray" },
  groupDetail: { fontSize: 18, marginVertical: 5 },
  label: { fontWeight: "bold" },
  sidebarToggleButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  sidebarToggleButtonText: { color: "white", fontSize: 24, fontWeight: "bold" },
});

export default Group;
