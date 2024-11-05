import React, { useEffect, useState, useCallback } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const Sidebar = ({ onSelectChat, refreshTrigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const fetchChats = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/chat/obtener-chats/1");
      if (!response.ok) throw new Error("Error al obtener los chats");

      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  const handleChatClick = (id_chat) => {
    if (onSelectChat) onSelectChat(id_chat);
    setIsOpen(false);
  };

  const handleNewChat = () => {
    if (onSelectChat) onSelectChat(null); // Envía null para indicar que se debe iniciar un nuevo chat
    setIsOpen(false);
  };

  useEffect(() => {
    fetchChats();
  }, [fetchChats, refreshTrigger]);

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="button-container">
        <button className="toggle-btn" onClick={toggleSidebar} aria-expanded={isOpen} aria-controls="sidebar-content">
          <i className="bi bi-list"></i>
        </button>
        {isOpen && (
          <button className="new-chat-btn" onClick={handleNewChat}>
            <i className="bi bi-plus-square"></i>
          </button>
        )}
      </div>
      {isOpen && (
        <div className="sidebar-content" id="sidebar-content">
          <ul>
            {chats.map((chat) => (
              <li key={chat.id_chat} onClick={() => handleChatClick(chat.id_chat)}>
                {chat.label_chat}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
