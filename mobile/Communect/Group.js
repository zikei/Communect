import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { View, Text, StyleSheet, Button } from "react-native";

function Group() {
  const [groups, setGroups] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [currentGroup, setCurrentGroup] = useState(null);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const localGroupData = [
    { groupId: "1", groupName: "Group 1", aboveId: null },
    { groupId: "2", groupName: "Group 2", aboveId: "1" },
    { groupId: "3", groupName: "Group 3", aboveId: "1" },
    { groupId: "4", groupName: "Group 4", aboveId: "2" },
    { groupId: "5", groupName: "Group 5", aboveId: null },
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
    if (!sidebarOpen) {
      toggleSidebar(); // サイドバーを閉じる
    }
  };

  useEffect(() => {
    try {
      const hierarchy = buildHierarchy(localGroupData);
      setGroups(hierarchy);
    } catch (err) {
      console.error("Error initializing groups:", err);
      setError("Failed to load groups.");
    }
  }, []);

  return (
    <View style={styles.container}>
      {sidebarOpen && (
        <Sidebar
          groups={groups}
          expandedGroups={expandedGroups}
          toggleGroup={toggleGroup}
          handleGroupClick={handleGroupClick}
          renderGroupTree={(group) => (
            <Button
              key={group.groupId}
              title={group.groupName}
              onPress={() => handleGroupClick(group)}
            />
          )}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          error={error}
        />
      )}

      <View style={styles.mainContent}>
        {!sidebarOpen && currentGroup ? (
          <View>
            <Text style={styles.groupDetail}>
              <Text style={styles.label}>Group Name:</Text> {currentGroup.groupName}
            </Text>
            <Text style={styles.groupDetail}>
              <Text style={styles.label}>Group ID:</Text> {currentGroup.groupId}
            </Text>
          </View>
        ) : (
          <Text style={styles.placeholderText}>
            {sidebarOpen
              ? "Select a group from the sidebar."
              : "No group selected."}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  placeholderText: {
    fontSize: 18,
    color: "gray",
  },
  groupDetail: {
    fontSize: 18,
    marginVertical: 5,
  },
  label: {
    fontWeight: "bold",
  },
});

export default Group;