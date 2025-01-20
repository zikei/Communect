import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash/debounce";
import { Card, Form, Row, Col, ListGroup } from "react-bootstrap";
import "../../css/userSearch.css";

function UserSearch({ onAddUsers, singleSelect = false }) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const fetchUsers = async (keyword) => {
    if (!keyword) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + `/user`, {
        params: { keyword },
        withCredentials: true,
      });
      const users = response.data.users;
      if (Array.isArray(users)) {
        setSearchResults(users);
      } else {
        setSearchResults([]);
        console.error("Unexpected API response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setSearchResults([]);
    }
  };

  const debouncedFetchUsers = debounce(fetchUsers, 300);

  useEffect(() => {
    debouncedFetchUsers(searchKeyword);
    return () => debouncedFetchUsers.cancel();
  }, [searchKeyword]);

  const handleUserSelect = (user) => {
    if (singleSelect) {
      setSelectedUsers([user]);
      onAddUsers([user]);
    } else {
      const isSelected = selectedUsers.some((u) => u.userId === user.userId);
      const updatedUsers = isSelected
        ? selectedUsers.filter((u) => u.userId !== user.userId)
        : [...selectedUsers, user];
      setSelectedUsers(updatedUsers);
      onAddUsers(updatedUsers);
    }
  };

  return (
    <div className="user-search px-4">
      <Form.Control
        type="text"
        placeholder="ユーザ名またはIDで検索"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        className="mb-3 search-bar"
      />
      <Row className="search-results">
        {searchResults.map((user) => (
          <Col
            key={user.userId}
            xs={12}
            sm={6}
            md={4}
            className="mb-3"
          >
            <Card
              className={`user-card ${
                selectedUsers.some((u) => u.userId === user.userId)
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleUserSelect(user)}
            >
              <Card.Body className="p-0">
                <Card.Title className="user-name">
                  {user.userName}
                </Card.Title>
                <Card.Text className="user-nickname">
                  {user.nickName}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {!singleSelect && selectedUsers.length > 0 && (
        <ListGroup className="selected-users mt-3">
          {selectedUsers.map((user) => (
            <ListGroup.Item key={user.userId} className="d-flex justify-content-between">
              <span>
                {user.userName} <small>({user.nickName})</small>
              </span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}

export default UserSearch;
