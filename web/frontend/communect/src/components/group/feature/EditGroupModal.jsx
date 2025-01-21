import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

function EditGroupModal({ group, onClose, onUpdateGroup }) {
  const [name, setName] = useState(group.groupName || "");
  const [above, setAbove] = useState(group.aboveGroupId || "");
  const [isParentGroup, setIsParentGroup] = useState(!group.aboveGroupId); // 最上位親グループか判定
  const [groupOptions, setGroupOptions] = useState([]); // 上位グループ候補リスト

  // 上位グループ候補の取得
  useEffect(() => {
    if (!isParentGroup) {
      fetchGroupOptions();
    }
  }, [isParentGroup]);

  // グループリストの取得
  /* その最上位親グループの中のグループを取得する処理をここで実装するのは現実的ではないので一旦保留。*/
  const fetchGroupOptions = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + "/group" ,
        {
          withCredentials: true,
        }
      );
  
      const groups = response.data.groups;
  
      if (Array.isArray(groups)) {
        // 選択されたグループの親（aboveId）に一致するグループのみを取得
        const filteredGroups = groups.filter(
          (g) => g.groupId === group.aboveGroupId
        );
        setGroupOptions(filteredGroups);
      } else {
        throw new Error("グループデータが配列ではありません");
      }
    } catch (error) {
      console.error("グループリスト取得エラー:", error);
      alert("上位グループリストの取得に失敗しました");
    }
  };
  

  const handleSave = async () => {
    try {
      const payload = {
        name: name.trim() || null,
        above: isParentGroup ? null : above.trim() || null,
      };

      const response = await axios.put(import.meta.env.VITE_API_URL + `/group/${group.groupId}`, payload ,{
        withCredentials: true,
      });
      if (response.status === 200) {
        alert("グループが更新されました。再読み込みを行ってください。");
        onUpdateGroup(group.groupId, payload); // 親に通知
        onClose(); // モーダルを閉じる
      }
    } catch (error) {
      console.error("グループ更新エラー:", error);
      alert("グループの更新に失敗しました");
    }
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>グループ編集</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="groupName">
            <Form.Label>グループ名</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="グループ名を入力"
            />
          </Form.Group>

          {/* 上位グループ選択 */}
          {!isParentGroup && (
            <Form.Group controlId="aboveGroupId" className="mt-3">
              <Form.Label>上位グループ</Form.Label>
              <Form.Control
                as="select"
                value={above}
                onChange={(e) => setAbove(e.target.value)}
              >
                <option value="">-- 上位グループを選択 --</option>
                {groupOptions.map((g) => (
                  <option key={g.groupId} value={g.groupId}>
                    {g.groupName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          キャンセル
        </Button>
        <Button variant="primary" onClick={handleSave}>
          保存
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

EditGroupModal.propTypes = {
  group: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateGroup: PropTypes.func.isRequired,
};

export default EditGroupModal;
