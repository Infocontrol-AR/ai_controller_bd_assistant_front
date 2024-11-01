import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="button-container">
        <button
          className="toggle-btn"
          onClick={toggleSidebar}
          aria-expanded={isOpen}
          aria-controls="sidebar-content"
        >
          <i className="bi bi-list"></i>
        </button>
        {isOpen && (
          <button className="new-chat-btn">
            <i class="bi bi-plus-square"></i>
          </button>
        )}
      </div>
      {isOpen && (
        <div className="sidebar-content" id="sidebar-content">
          <ul>
            <li>Conversación 1</li>
            <li className="separator"></li>
            <li>Conversación 2</li>
            <li className="separator"></li>
            <li>Conversación 3</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
