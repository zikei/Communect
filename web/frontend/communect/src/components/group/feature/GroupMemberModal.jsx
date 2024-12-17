import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import EditGroupMemberModal from "./EditGroupMemberModal";
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
  const [editingMember, setEditingMember] = useState(null);

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
    setEditingMember(null); // 編集終了後にメンバーをリストに反映
  };

  return (
    <>
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Group Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : error ? (
            <div className="text-danger text-center">{error}</div>
          ) : members.length > 0 ? (
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">No members found in this group.</div>
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
    </>
  );
}

GroupMemberModal.propTypes = {
  groupId: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default GroupMemberModal;
