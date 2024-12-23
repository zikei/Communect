import React from "react";
import { Col, ListGroup, Button, Spinner, Alert } from "react-bootstrap";
import styles from "../../css/module/groupTalk.module.css";

const TalkSidebar = ({ talks, loading, error, onSelectTalk, setShowCreateModal, selectedTalk }) => {
  return (
    <Col xs={3} className={`${styles["groupTalk-sidebar"]} p-0`}>
      <div className="d-flex justify-content-between align-items-center">
        <h5>トークルーム一覧</h5>
        <Button variant="link" className="text-primary" onClick={() => setShowCreateModal(true)}>
          <i className="bi bi-plus-circle" style={{ fontSize: "1.5rem" }}></i>
        </Button>
      </div>
      {loading ? (
        <div className="text-center mt-3">
          <Spinner animation="border" role="status" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : talks.length > 0 ? (
        <ListGroup>
          {talks.map((talk) => (
            <ListGroup.Item
              key={talk.talkId}
              action
              active={talk.talkId === selectedTalk}
              onClick={() => onSelectTalk(talk.talkId)}
            >
              {talk.talkName}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-center mt-3">トークルームがありません。</p>
      )}
    </Col>
  );
};

export default TalkSidebar;
