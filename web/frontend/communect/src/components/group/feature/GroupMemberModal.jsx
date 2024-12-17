import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import styles from "../../../css/module/groupMemberModal.module.css";

function GroupMemberModal({ groupId, show, onClose }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
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
                  {/* メンバーのアイコンを表示（仮にイニシャルを使用） */}
                  {member.userName.charAt(0).toUpperCase()}
                </div>
                <div className={styles.bubble}>
                  <div className={styles.userName}>
                    {member.userName} <small>({member.nickName})</small>
                  </div>
                  <div className={styles.role}>Role: {member.role}</div>
                  <div className={styles.permissions}>
                    Admin: {member.isAdmin ? "Yes" : "No"} | Sub-Group:{" "}
                    {member.isSubGroupCreate ? "Yes" : "No"}
                  </div>
                </div>
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
  );
}

GroupMemberModal.propTypes = {
  groupId: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default GroupMemberModal;
