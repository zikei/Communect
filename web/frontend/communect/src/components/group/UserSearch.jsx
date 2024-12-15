import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash/debounce";
import "../../css/userSearch.css";

function UserSearch({ onAddUsers }) {
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

  const toggleUserSelection = (user) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u.userId === user.userId);
      const updatedUsers = isSelected
        ? prev.filter((u) => u.userId !== user.userId)
        : [...prev, user];

      // 状態確定後に親コンポーネントに送信する
      onAddUsers(updatedUsers);
      return updatedUsers;
    });
  };

  return (
    <div className="user-search container">
      <div className="search-bar mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="ユーザ名またはIDで検索"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      <div className="search-results row">
        {searchResults.map((user) => (
          <div key={user.userId} className="col-12 col-md-6 mb-3">
            <div className="card search-result-item p-2">
              <div className="d-flex align-items-center">
                <input
                  type="checkbox"
                  checked={selectedUsers.some((u) => u.userId === user.userId)}
                  onChange={() => toggleUserSelection(user)}
                  className="form-check-input me-2"
                />
                <span>
                  {user.userName} <small>({user.nickName})</small>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedUsers.length > 0 && (
        <div className="selected-users col-10 mt-4">
          <h5>選択されたユーザ:</h5>
          <ul className="list-group">
            {selectedUsers.map((user) => (
              <li key={user.userId} className="list-group-item d-flex justify-content-between align-items-center">
                {user.userName} <small>({user.nickName})</small>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => toggleUserSelection(user)}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserSearch;
