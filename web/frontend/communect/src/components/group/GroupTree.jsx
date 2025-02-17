import React, { useState } from "react";
import DeleteButton from "./feature/DeleteButton";
import PropTypes from "prop-types";
import "../../css/groupTree.css";

function GroupTree({
  group,
  level = 0,
  expandedGroups,
  toggleGroup,
  handleGroupClick,
  currentGroup,
  onDeleteGroup,
  onUpdateGroup,
  onEditGroup,
  onShowMembers,
  onOpenTalk, 
}) {
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [isTalkOpen, setIsTalkOpen] = useState(false); 

  const isSelected = currentGroup && currentGroup.groupId === group.groupId;

  const handleEditClick = () => {
    onEditGroup(group);
  };

  const handleTalkToggle = () => {
    if (isTalkOpen) {
      setIsTalkOpen(false);
      onOpenTalk(null);
    } else {
      setIsTalkOpen(true);
      onOpenTalk(group);
    }
  };

  return (
    <li
      key={group.groupId}
      className={`list-group-item ${isSelected ? "selected-group" : ""}`}
    >
      <div className="d-flex align-items-center group-item-container">
        {isSelected && (
          <div
            className="plus-icon-container"
            onMouseEnter={() => setShowPlusMenu(true)}
            onMouseLeave={() => setShowPlusMenu(false)}
          >
            <i className="bi bi-plus-circle plus-icon"></i>
            {showPlusMenu && (
              <ul className="plus-menu">
                <li
                  className="plus-menu-item"
                  onClick={() => onShowMembers(group.groupId)}
                >
                  メンバー表示
                </li>
                <li className="plus-menu-item" onClick={handleEditClick}>
                  グループ編集
                </li>
              </ul>
            )}
          </div>
        )}
        <button
          className="btn btn-link text-decoration-none w-100 text-start text-truncate"
          onClick={() => handleGroupClick(group)}
        >
          {group.groupName}
        </button>
        {isSelected && (
          <>
            <DeleteButton groupId={group.groupId} onDelete={onDeleteGroup} />
            <button
              className="btn btn-sm btn-primary talk-button ms-2"
              onClick={handleTalkToggle} // 状態切り替えロジック
            >
              {isTalkOpen ? (
                <i className="bi bi-arrow-left-circle"></i> // 戻る
              ) : (
                <i className="bi bi-chat-dots"></i> // トーク
              )}
            </button>
          </>
        )}
        {group.children.length > 0 && (
          <button
            className="btn btn-sm group-toggle-btn"
            onClick={() => toggleGroup(group.groupId)}
          >
            <span
              className={`rotate-icon ${expandedGroups[group.groupId] ? "rotated" : ""}`}
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
              onUpdateGroup={onUpdateGroup}
              onEditGroup={onEditGroup}
              onShowMembers={onShowMembers}
              onOpenTalk={onOpenTalk}
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
  onUpdateGroup: PropTypes.func.isRequired,
  onEditGroup: PropTypes.func.isRequired,
  onShowMembers: PropTypes.func.isRequired,
  onOpenTalk: PropTypes.func.isRequired,
};

export default GroupTree;
