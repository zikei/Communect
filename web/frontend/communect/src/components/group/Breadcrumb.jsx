import React from "react";

const Breadcrumb = ({ breadcrumb, handleGroupClick }) => (
  <nav aria-label="breadcrumb">
    <ol className="breadcrumb m-0 mx-3 my-2">
      {breadcrumb.map((item, index) => (
        <li key={item.groupId} className="breadcrumb-item">
          {index === breadcrumb.length - 1 ? (
            <span>{item.groupName}</span>
          ) : (
            <a href="#" onClick={() => handleGroupClick(item)}>
              {item.groupName}
            </a>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumb;