import React from "react";
import PropTypes from "prop-types";

function DeleteButton({ groupId, onDelete }) {
  const handleDelete = async () => {
    if (!window.confirm("このグループを削除しますか？")) return;

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/group/${groupId}`, { method: "DELETE" });
        if (!response.ok) {
          throw new Error("Failed to delete group");
        }
      onDelete(groupId); // UI更新を親コンポーネントに通知
    } catch (err) {
      console.error("Error deleting group:", err);
      alert("グループの削除に失敗しました。もう一度試してください。");
    }
  };

  return (
    <i
      className="bi bi-trash-fill text-danger ms-2"
      role="button"
      title="グループを削除"
      onClick={handleDelete}
      style={{ cursor: "pointer" }}
    ></i>
  );
}

DeleteButton.propTypes = {
  groupId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteButton;