import React from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";

function ReactionsModal({ reactions, post, onClose }) {
  /* リアクションを選択肢ごとにグループ化 */
  const reactionsByChoice = reactions.reduce((acc, reaction) => {
    const choice = reaction.choice?.choice || "未指定";
    if (!acc[choice]) acc[choice] = [];
    acc[choice].push(reaction);
    return acc;
  }, {});

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>リアクション詳細</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>投稿:</strong> {post?.message}</p>
        {Object.keys(reactionsByChoice).length > 0 ? (
          Object.entries(reactionsByChoice).map(([choice, reactions]) => (
            <div key={choice} className="mb-4">
              <h5 className="text-primary">{choice}</h5>
              <ListGroup>
                {reactions.map((reaction) => (
                  <ListGroup.Item key={reaction.reactionId}>
                    {reaction.nickName} ({reaction.userName})
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          ))
        ) : (
          <p>リアクションがありません。</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          閉じる
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ReactionsModal;