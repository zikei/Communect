import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import EditGroupMemberModal from "./EditGroupMemberModal";
import AddUserModal from "./AddUserModal";
import styles from "../../../css/module/groupMemberModal.module.css";

const ROLE_DISPLAY_MAP = {
  HIGH: "高",
  MEDIUM: "中",
  LOW: "低",
  SAFE: "最低",
  NONE: "なし",
};

function GroupMemberModal({ groupId, show, onClose }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + "/user/login", {
          withCredentials: true,
          credentials: "include",
        });
        if (response.data && response.data.userId) {
          setCurrentUserId(response.data.userId);
        } else {
          setError("ユーザ情報の取得に失敗しました");
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        setError("Failed to fetch current user. Please try again.");
      }
    };
  
    // show が true の時だけ currentUserId を取得
    if (show) {
      fetchCurrentUserId();
    }
  }, [show]); 

  const fetchGroupMembers = async () => {
    if (!show || !groupId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/group/${groupId}/user`,
        { withCredentials: true, credentials: "include" }
      );

      if (response.data && Array.isArray(response.data.users)) {
        setMembers(
          response.data.users.filter(
            (user) => user !== null && user !== undefined
          )
        );
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (err) {
      console.error("Error fetching group members:", err);
      setError("Failed to load members. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      fetchGroupMembers();
    }
  }, [show, groupId]);

  const handleEditClick = (member) => {
    console.log("Current user ID:", currentUserId);  // 現在のユーザIDを確認
    console.log("Member ID:", member.groupUserId);   // メンバーのIDを確認
    console.log("Is Admin:", member.isAdmin);        // メンバーが管理者かどうか確認
  
    if (member.isAdmin || member.groupUserId === currentUserId) {
      setEditingMember(member);
    } else {
      alert("You do not have permission to edit this member.");
    }
  };

  const handleMemberUpdate = (updatedMember) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.groupUserId === updatedMember.groupUserId
          ? updatedMember
          : member
      )
    );
    setEditingMember(null);
  };

  const handleDeleteClick = async (groupUserId) => {
    if (!groupUserId) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/group/${groupId}/user`,
        {
          data: { groupUserId },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        await fetchGroupMembers();
        setSuccessMessage("メンバーを削除しました。");
      } else {
        throw new Error("Failed to delete member.");
      }
    } catch (err) {
      console.error("Error deleting member:", err);
      setError("メンバーの削除に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (newUser) => {
    await fetchGroupMembers(); // 追加後に最新データを取得
    setShowAddUserModal(false);
  };

  return (
    <>
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title className={styles.modalTitle}>
            グループメンバー
          </Modal.Title>
          <button
            className={styles.addUserButton}
            onClick={() => setShowAddUserModal(true)}
          >
            ＋
          </button>
        </Modal.Header>
        <Modal.Body>
          {loading && (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {members.length > 0 ? (
            <div className={styles.membersList}>
              {members
                .filter((member) => member && member.userName)
                .map((member) => (
                  <div key={member.groupUserId} className={styles.memberItem}>
                    <div className={styles.avatar}>
                      {member.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.bubble}>
                      <div className={styles.userName}>
                        {member.userName} <small>({member.nickName})</small>
                      </div>
                      <div className={styles.role}>
                        連絡権限: {ROLE_DISPLAY_MAP[member.role]}
                      </div>
                      <div className={styles.permissions}>
                        管理者権限: {member.isAdmin ? "Yes" : "No"}
                        <br />
                        下位グループ作成権限:{" "}
                        {member.isSubGroupCreate ? "Yes" : "No"}
                      </div>
                    </div>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditClick(member)}
                    >
                      ✎
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteClick(member.groupUserId)}
                    >
                      🗑
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            !loading && (
              <div className="text-center">No members found in this group.</div>
            )
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {editingMember && (
        <EditGroupMemberModal
          groupId={groupId}
          member={editingMember}
          show={!!editingMember}
          onClose={() => setEditingMember(null)}
          onSave={handleMemberUpdate}
          currentUserId={currentUserId}
        />
      )}

      {showAddUserModal && (
        <AddUserModal
          groupId={groupId}
          show={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          onAddUser={handleAddUser}
          existingMembers={members}
        />
      )}
    </>
  );
}

export default GroupMemberModal;