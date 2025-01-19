import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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

  useEffect(() => {
    const fetchGroupMembers = async () => {
      if (!show || !groupId) return;

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/group/${groupId}/user`
        );
        if (response.data && Array.isArray(response.data.users)) {
          setMembers(response.data.users);
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

    fetchGroupMembers();
  }, [show, groupId]);

  const handleEditClick = (member) => {
    setEditingMember(member);
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
        }
      );

      if (response.status === 200) {
        setMembers((prev) =>
          prev.filter((member) => member.groupUserId !== groupUserId)
        );
        setSuccessMessage("Member deleted successfully.");
      } else {
        throw new Error("Failed to delete member.");
      }
    } catch (err) {
      console.error("Error deleting member:", err);
      setError("Failed to delete member. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = (newUser) => {
    setMembers((prev) => [...prev, newUser]);
    setShowAddUserModal(false);
  };

  return (
    <>
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title className={styles.modalTitle}>Group Members</Modal.Title>
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
          {!loading && !error && members.length > 0 ? (
            <div className={styles.membersList}>
              {members.map((member) => (
                <div key={member.groupUserId} className={styles.memberItem}>
                  <div className={styles.avatar}>
                    {member.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.bubble}>
                    <div className={styles.userName}>
                      {member.userName} <small>({member.nickName})</small>
                    </div>
                    <div className={styles.role}>
                      Role: {ROLE_DISPLAY_MAP[member.role] || "未設定"}
                    </div>
                    <div className={styles.permissions}>
                      Admin: {member.isAdmin ? "Yes" : "No"} | Sub-Group:{" "}
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
        />
      )}

      {showAddUserModal && (
        <AddUserModal
          groupId={groupId}
          show={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          onAddUser={handleAddUser}
        />
      )}
    </>
  );
}

GroupMemberModal.propTypes = {
  groupId: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default GroupMemberModal;
