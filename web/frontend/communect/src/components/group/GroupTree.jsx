import React from "react";
import DeleteButton from "./DeleteButton";
import PropTypes from "prop-types";

function GroupTree({
  group,
  level = 0,
  expandedGroups,
  toggleGroup,
  handleGroupClick,
  currentGroup,
  onDeleteGroup,
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

        {/* 削除ボタン（右端）: 選択されている場合のみ表示 */}
        {isSelected && (
          <DeleteButton
            groupId={group.groupId}
            onDelete={onDeleteGroup} // 削除後の処理を親コンポーネントに通知
          />
        )}
        
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
              currentGroup={currentGroup}
              onDeleteGroup={onDeleteGroup}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

GroupTree.propTypes = {
  group: PropTypes.object.isRequired,
  level: PropTypes.number,
  expandedGroups: PropTypes.object.isRequired,
  toggleGroup: PropTypes.func.isRequired,
  handleGroupClick: PropTypes.func.isRequired,
  currentGroup: PropTypes.object,
  onDeleteGroup: PropTypes.func.isRequired,
};

export default GroupTree;
