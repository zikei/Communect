import React from "react";

function GroupTree({
  group,
  level = 0,
  expandedGroups,
  toggleGroup,
  handleGroupClick,
  currentGroup, // 現在のグループを受け取る
}) {
  // 選択されたグループかどうかを判定
  const isSelected = currentGroup && currentGroup.groupId === group.groupId;

  return (
    <li
      key={group.groupId}
      className={`list-group-item ${isSelected ? "selected-group" : ""}`} // ハイライト用クラス
    >
      <div className="d-flex align-items-center">
        <button
          className="btn btn-link text-decoration-none w-100 text-start text-truncate"
          onClick={() => handleGroupClick(group)}
        >
          {group.groupName}
        </button>
        {group.children.length > 0 && (
          <button
            className="btn btn-sm group-toggle-btn"
            onClick={() => toggleGroup(group.groupId)}
          >
            <span
              className={`rotate-icon ${
                expandedGroups[group.groupId] ? "rotated" : ""
              }`}
            >
              &gt;
            </span>
          </button>
        )}
      </div>
      {group.children.length > 0 && expandedGroups[group.groupId] && (
        <ul className="list-unstyled">
          {group.children.map((child) => (
            <GroupTree
              key={child.groupId}
              group={child}
              level={level + 1}
              expandedGroups={expandedGroups}
              toggleGroup={toggleGroup}
              handleGroupClick={handleGroupClick}
              currentGroup={currentGroup} // 子にも渡す
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default GroupTree;
