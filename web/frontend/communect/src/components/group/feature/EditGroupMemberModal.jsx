import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios"; // APIリクエスト用

const ROLE_DISPLAY_MAP = {
  HIGH: "高",
  MEDIUM: "中",
  LOW: "低",
  SAFE: "最低",
  NONE: "なし",
};

function EditGroupMemberModal({ groupId, member, currentUserId, show, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nickName: member.nickName || "",
    role: member.role || "",
    isAdmin: member.isAdmin || false,
    isSubGroupCreate: member.isSubGroupCreate || false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // ローディング状態

  useEffect(() => {
    // 自分の情報を編集する場合、ニックネームのみ変更可能に制限
    if (member.userId === currentUserId) {
      setFormData((prev) => ({
        ...prev,
        role: null, // 自分自身の編集ではroleは変更できない
        isAdmin: null, // 自分自身の編集ではisAdminは変更できない
        isSubGroupCreate: null, // 自分自身の編集ではisSubGroupCreateは変更できない
      }));
    }
  }, [member, currentUserId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.nickName) {
      setError("ニックネームは必須です。");
      return false;
    }

    // 管理者権限を持たない場合はエラー
    if (member.userId !== currentUserId && !member.isAdmin) {
      setError("管理者権限がないため、このメンバーを編集できません。");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true); // リクエスト開始

    // 自分自身を編集する場合、ニックネームだけ変更できるように設定
    const updatedMember = { ...formData, groupUserId: member.groupUserId };

    // 自分の情報を編集する場合、役割や管理者権限は含めない
    if (member.userId === currentUserId) {
      delete updatedMember.role;
      delete updatedMember.isAdmin;
      delete updatedMember.isSubGroupCreate;
    }

    try {
      // APIリクエスト
      const response = await axios.put(
        `/group/${groupId}/user`,
        updatedMember
      );
      
      // 成功時の処理
      onSave(response.data.user); // 親コンポーネントにデータを渡す
      onClose();
    } catch (err) {
      // エラーハンドリング
      setError("メンバーの更新に失敗しました。再度お試しください。");
    } finally {
      setLoading(false); // ローディング解除
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>メンバー編集</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>ニックネーム</Form.Label>
            <Form.Control
              type="text"
              name="nickName"
              value={formData.nickName}
              onChange={handleChange}
              disabled={member.userId === currentUserId} // 自分のニックネームは編集不可
            />
          </Form.Group>
          {member.userId !== currentUserId && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>連絡権限</Form.Label>
                <Form.Control
                  as="select"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="">選択してください</option>
                  {Object.keys(ROLE_DISPLAY_MAP).map((role) => (
                    <option key={role} value={role}>
                      {ROLE_DISPLAY_MAP[role]}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Admin"
                  name="isAdmin"
                  checked={formData.isAdmin}
                  onChange={handleChange}
                />
                <Form.Check
                  type="checkbox"
                  label="Can create sub-group"
                  name="isSubGroupCreate"
                  checked={formData.isSubGroupCreate}
                  onChange={handleChange}
                />
              </Form.Group>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          やめる
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading} // ローディング中はボタン無効化
        >
          {loading ? "保存中..." : "保存"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

EditGroupMemberModal.propTypes = {
  groupId: PropTypes.string.isRequired,
  member: PropTypes.object.isRequired,
  currentUserId: PropTypes.string.isRequired, // 現在ログインしているユーザーID
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditGroupMemberModal;
