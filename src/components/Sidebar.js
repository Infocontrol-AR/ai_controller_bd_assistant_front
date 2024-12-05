import React, { useEffect, useState, useCallback } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const Sidebar = ({
  onSelectChat,
  refreshTrigger,
  selectedChatId,
  handleNewChat,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [menuVisible, setMenuVisible] = useState(null);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const fetchChats = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/chat/obtener-chats/1"
      );
      const data = await response.json();
      // console.log(data);
      setChats(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  const handleChatClick = (id_chat) => {
    console.log(id_chat);
    if (onSelectChat) onSelectChat(id_chat);
    setIsOpen(false);
  };

  const handleNewChatClick = () => {
    if (onSelectChat) onSelectChat(null);
    setIsOpen(false);
  };

  const handleMenuClick = (id_chat) => {
    setMenuVisible(menuVisible === id_chat ? null : id_chat);
  };

  const handleDeleteChat = async (id_chat) => {
    console.log(`Eliminando chat con id: ${id_chat}`);

    try {
      const response = await fetch(
        `http://localhost:5000/chat/eliminar-chat/${id_chat}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Error al eliminar el chat");

      if (selectedChatId === id_chat) {
        if (onSelectChat) onSelectChat(null);
        setIsOpen(false);
      }

      fetchChats();
    } catch (error) {
      console.error("Error:", error);
    }

    setMenuVisible(null);
  };

  useEffect(() => {
    fetchChats();
  }, [fetchChats, refreshTrigger]);

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
          <button className="new-chat-btn" onClick={handleNewChatClick}>
            <i className="bi bi-plus-square"></i>
          </button>
        )}
      </div>
      {isOpen && (
        <div className="sidebar-content" id="sidebar-content">
          {chats.length === 0 ? (
            <p
              style={{
                width: "max-content",
                margin: "auto",
                fontSize: "11px",
              }}
            >
              No hay Chats disponibles
            </p>
          ) : (
            <ul style={{ position: "relative" }}>
              {chats.map((chat) => (
                <li
                  key={chat.id_chat}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor:
                      selectedChatId === chat.id_chat
                        ? "#57616b29"
                        : "transparent",
                  }}
                >
                  <span
                    onClick={() => handleChatClick(chat.id_chat)}
                  >
                    {chat.label_chat}
                  </span>
                  <i
                    className="bi bi-three-dots"
                    style={{
                      fontSize: "12px",
                      cursor: "pointer",
                      marginLeft: "10px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuClick(chat.id_chat);
                    }}
                  ></i>

                  {menuVisible === chat.id_chat && (
                    <div
                      className="context-menu"
                      style={{
                        position: "absolute",
                        right: "0",
                        top: "20px",
                        background: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        padding: "5px",
                        zIndex: 10,
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <button
                        onClick={() => handleDeleteChat(chat.id_chat)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                        }}
                      >
                        <i
                          className="bi bi-trash"
                          style={{ marginRight: "5px" }}
                        ></i>
                        Eliminar
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
