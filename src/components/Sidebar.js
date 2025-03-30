import React, { useEffect, useState, useCallback, useRef } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const Sidebar = ({
  onSelectChat,
  refreshTrigger,
  selectedChatId,
  handleNewChat,
  logo,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [menuVisible, setMenuVisible] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isArchived, setIsArchived] = useState(false);

  const searchInputRef = useRef(null);
  const menuRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  let demo = true;

  const demoData = [
    {
        "id_chat": 1,
        "label_chat": "Greeting & assistance 😊",
        "status": "activo",
        "created_at": "2025-03-27T08:52:02.103Z"
    }
];

  const fetchChats = useCallback(async () => {
    try {
      let data;
      if (!demo) {
        const response = await fetch(
          "http://localhost:5000/chat/obtener-chats/1"
        );
        data = await response.json();
      } else {
        data = demoData;
      }
      setChats(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  const handleChatClick = (id_chat) => {
    if (onSelectChat) onSelectChat(id_chat);
    setIsOpen(false);
  };

  const handleMenuClick = (id_chat) => {
    setMenuVisible(menuVisible === id_chat ? null : id_chat);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuVisible(null); 
    }
  };

  useEffect(() => {
    if (menuVisible !== null) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuVisible]);

  const handleDeleteChat = async (id_chat) => {
    try {
      const response = await fetch(
        `http://localhost:5000/chat/eliminar-chat/${id_chat}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Error deleting chat");

      if (selectedChatId === id_chat) {
        if (onSelectChat) onSelectChat(null);
      }

      fetchChats();
    } catch (error) {
      console.error("Error:", error);
    }
    setIsOpen(true);
    setMenuVisible(null);
  };

  const handleFiledChat = async (id_chat, status) => {
    try {
      if (status === "activo") {
        status = "archivado";
      } else {
        status = "activo";
      }

      const response = await fetch(
        `http://localhost:5000/chat/cambiar-estado`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_chat, status }),
        }
      );
      if (!response.ok) throw new Error("Error changing chat status");

      if (selectedChatId === id_chat) {
        if (onSelectChat) onSelectChat(null);
      }

      fetchChats();
    } catch (error) {
      console.error("Error:", error);
    }
    setIsOpen(true);
    setMenuVisible(null);
  };

  useEffect(() => {
    fetchChats();
  }, [fetchChats, refreshTrigger]);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isArchived]);

  const filteredChats = chats.filter((chat) => {
    const isMatchingLabel = chat.label_chat
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const isArchivedMatch = isArchived
      ? chat.status === "archivado"
      : chat.status === "activo";
    return isMatchingLabel && isArchivedMatch;
  });

  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const recentChats = filteredChats.filter((chat) => isToday(chat.created_at));
  const olderChats = filteredChats.filter((chat) => !isToday(chat.created_at));

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="button-container">
        {isOpen && (
          <img src={logo} style={{ height: "auto", width: "50%" }} alt="Logo" />
        )}
        <button
          className="toggle-btn"
          onClick={toggleSidebar}
          aria-expanded={isOpen}
          aria-controls="sidebar-content"
        >
          <i className={`bi ${isOpen ? "bi-x" : "bi-list"}`}></i>
        </button>
      </div>

      {isOpen && (
        <div className="sidebar-content" id="sidebar-content">
          <div className="tab-switch">
            <button
              className={`tab-btn ${!isArchived ? "active" : ""}`}
              onClick={() => setIsArchived(false)}
            >
              Chats
            </button>
            <button
              className={`tab-btn ${isArchived ? "active" : ""}`}
              onClick={() => setIsArchived(true)}
            >
              Archived
            </button>
          </div>

          <div className="search-bar">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onInput={(e) => setSearchTerm(e.target.value)}
            />
            <i className="bi bi-search"></i>
          </div>

          <ul>
            {filteredChats.length === 0 ? (
              <p className="noChats">No chats available</p>
            ) : (
              <>
                {recentChats.length > 0 && (
                  <>
                    <h5 style={{ paddingLeft: "10px" }}>Recent</h5>
                    {recentChats.map((chat) => (
                      <li
                        key={chat.id_chat}
                        className={`chat-item ${
                          selectedChatId === chat.id_chat ? "selected" : ""
                        }`}
                        onClick={() => handleChatClick(chat.id_chat)}
                      >
                        {chat.label_chat}
                        <i
                          className="bi bi-three-dots"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuClick(chat.id_chat);
                          }}
                        ></i>
                        {menuVisible === chat.id_chat && (
                          <div className="context-menu" ref={menuRef}>
                            <button
                              onClick={() => handleDeleteChat(chat.id_chat)}
                            >
                              <i className="bi bi-trash"></i> Delete
                            </button>
                            <hr style={{ margin: "0.5rem 0" }} />
                            <button
                              onClick={() =>
                                handleFiledChat(chat.id_chat, chat.status)
                              }
                            >
                              <i className="bi bi-archive"></i>{" "}
                              {chat.status === "activo"
                                ? "Archive"
                                : "Unarchive"}
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </>
                )}

                {olderChats.length > 0 && (
                  <>
                    <h5>Older</h5>
                    {olderChats.map((chat) => (
                      <li
                        key={chat.id_chat}
                        className={`chat-item ${
                          selectedChatId === chat.id_chat ? "selected" : ""
                        }`}
                        onClick={() => handleChatClick(chat.id_chat)}
                      >
                        {chat.label_chat}
                        <i
                          className="bi bi-three-dots"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuClick(chat.id_chat);
                          }}
                        ></i>
                        {menuVisible === chat.id_chat && (
                          <div className="context-menu" ref={menuRef}>
                            <button
                              onClick={() => handleDeleteChat(chat.id_chat)}
                            >
                              <i className="bi bi-trash"></i> Delete
                            </button>
                            <hr style={{ margin: "0.5rem 0" }} />
                            <button
                              onClick={() =>
                                handleFiledChat(chat.id_chat, chat.status)
                              }
                            >
                              <i className="bi bi-archive"></i>{" "}
                              {chat.status === "activo"
                                ? "Archive"
                                : "Unarchive"}
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </>
                )}
              </>
            )}
          </ul>
        </div>
      )}

      <div className="bottom-buttons">
        <button className="mode-toggle">
          <i className="bi bi-moon"></i>
        </button>
        <button className="notifications-btn">
          <i className="bi bi-bell"></i>
        </button>
        <button className="settings-btn">
          <i className="bi bi-gear"></i>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
