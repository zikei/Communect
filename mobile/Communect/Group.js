import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, ScrollView } from "react-native";

function Group() {
  const [groups, setGroups] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [currentGroup, setCurrentGroup] = useState(null);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [groupName, setGroupName] = useState("");
  const [parentId, setParentId] = useState(null);

  const localGroupData = [
    { groupId: "1", groupName: "Group 1", aboveId: null, children: [] },
    { groupId: "2", groupName: "Group 2", aboveId: "1", children: [] },
    { groupId: "3", groupName: "Group 3", aboveId: "1", children: [] },
    { groupId: "4", groupName: "Group 4", aboveId: "2", children: [] },
    { groupId: "5", groupName: "Group 5", aboveId: "1", children: [] },
    { groupId: "6", groupName: "Group 6", aboveId: "5", children: [] },
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
      toggleSidebar();
    }
  };

  const createGroup = () => {
    if (!groupName) return;

    const newGroup = {
      groupId: (groups.length + 1).toString(),
      groupName: groupName,
      aboveId: parentId,
      children: [],
    };

    if (parentId) {
      const updatedGroups = groups.map((group) =>
        group.groupId === parentId
          ? { ...group, children: [...group.children, newGroup] }
          : group
      );
      setGroups(updatedGroups);
    } else {
      setGroups([...groups, newGroup]);
    }

    setGroupName("");
    setParentId(null);
  };

  const renderGroupTree = (group, level = 0) => (
    <View key={group.groupId} style={{ paddingLeft: level * 20 }}>
      <Text
        style={styles.groupItem}
        onPress={() => handleGroupClick(group)}
      >
        {group.groupName}
      </Text>
      {expandedGroups[group.groupId] &&
        group.children.map((child) => renderGroupTree(child, level + 1))}
    </View>
  );

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
        <Sidebar>
          <ScrollView>
            {groups.map((group) => !group.aboveId && renderGroupTree(group))}
          </ScrollView>
        </Sidebar>
      )}

      <View
        style={[
          styles.mainContent,
          { marginLeft: sidebarOpen ? 250 : 0 },
        ]}
      >
        {currentGroup ? (
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

        <View style={styles.formContainer}>
          <Text>Create a New Group</Text>
          <TextInput
            style={styles.input}
            placeholder="Group Name"
            value={groupName}
            onChangeText={setGroupName}
          />
          <TextInput
            style={styles.input}
            placeholder="Parent Group ID (optional)"
            value={parentId}
            onChangeText={setParentId}
          />
          <Button title="Create Group" onPress={createGroup} />
        </View>
      </View>

      {!sidebarOpen && (
        <TouchableOpacity
          style={styles.sidebarToggleButton}
          onPress={toggleSidebar}
        >
          <Text style={styles.sidebarToggleButtonText}>☰</Text>
        </TouchableOpacity>
      )}
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
  sidebarToggleButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  groupItem: {
    padding: 10,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 10,
  },
  formContainer: {
    marginTop: 20,
  },
});

export default Group;
