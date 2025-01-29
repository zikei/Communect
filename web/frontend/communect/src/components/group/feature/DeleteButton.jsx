import React, { useState } from "react";
import PropTypes from "prop-types";

function DeleteButton({ groupId, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return; // 二重実行防止
    if (!window.confirm("このグループを削除しますか？")) return;

    setIsDeleting(true); // 削除処理開始
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/group/${groupId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text(); // エラーメッセージを取得
        throw new Error(`Failed to delete group: ${errorText}`);
      }

      // 削除が成功したら、親コンポーネントに通知
      onDelete(groupId);
    } catch (err) {
      console.error("Error deleting group:", err);
      alert(`グループの削除に失敗しました: ${err.message}`);
    } finally {
      setIsDeleting(false); // 処理完了後に解除
    }
  };

  return (
    <i
      className={`bi bi-trash-fill text-danger ms-2 ${isDeleting ? "disabled" : ""}`}
      role="button"
      title="グループを削除"
      onClick={handleDelete}
      style={{ cursor: isDeleting ? "not-allowed" : "pointer" }}
    ></i>
  );
}

DeleteButton.propTypes = {
  groupId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteButton;
