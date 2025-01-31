import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash/debounce";
import { Card, Form, Row, Col, ListGroup } from "react-bootstrap";
import "../../css/userSearch.css";

function UserSearch({ onAddUsers, singleSelect = false }) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + "/user/login", {
          withCredentials: true,
          credentials: "include",
        });
        console.log("Current User:", response.data); // ログインユーザー情報を確認
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        setIsUserLoaded(true);
      }
    };
    fetchCurrentUser();
  }, []);

  const fetchUsers = async (keyword) => {
    if (!keyword || !currentUser) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + "/user", {
        params: { keyword },
        withCredentials: true,
      });
  
      let users = response.data.users || [];
  
      // ログイン中のユーザーを除外（正しい userId を取得）
      if (currentUser?.user?.userId) {
        users = users.filter(user => user.userId !== currentUser.user.userId);
      }
  
      setSearchResults(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setSearchResults([]);
    }
  };
  

  const debouncedFetchUsers = debounce(fetchUsers, 300);

  useEffect(() => {
    if (isUserLoaded && searchKeyword) {
      debouncedFetchUsers(searchKeyword);
    }
    return () => debouncedFetchUsers.cancel();
  }, [searchKeyword, isUserLoaded]);

  const handleUserSelect = (user) => {
    // 自分自身の選択を防止
    if (user.userId === currentUser?.userId) {
      console.warn("Cannot select current user");
      return;
    }

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
          <Col key={user.userId} xs={12} sm={6} md={4} className="mb-3">
            <Card
              className={`user-card ${
                selectedUsers.some((u) => u.userId === user.userId) ? "selected" : ""
              }`}
              onClick={() => handleUserSelect(user)}
            >
              <Card.Body className="p-0">
                <Card.Title className="user-name">{user.userName}</Card.Title>
                <Card.Text className="user-nickname">{user.nickName}</Card.Text>
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
