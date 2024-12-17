import React from "react";

function ReactionsModal({ reactions, post, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-close" onClick={onClose}></button>
        <h2>リアクション詳細</h2>
        <p>{post?.message}</p>
        {reactions.length > 0 ? (
          <ul>
            {reactions.map((reaction) => (
              <li key={reaction.reactionId}>
                {reaction.nickName} ({reaction.userName})
              </li>
            ))}
          </ul>
        ) : (
          <p>リアクションがありません。</p>
        )}
      </div>
    </div>
  );
}

export default ReactionsModal;