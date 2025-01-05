// App.js
import React, { useState } from 'react';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';
import logo from "./infocontrol.png";
import textGif from "./text.gif";

const App = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showModal, setShowModal] = useState(false); 

  const handleChatSelect = (id_chat) => {
    setSelectedChatId(id_chat);
  };

  const handleNewChat = (newIdChat) => {
    setSelectedChatId(newIdChat);
    triggerSidebarRefresh();
  };

  const triggerSidebarRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="app">
      <Sidebar
        onSelectChat={handleChatSelect}
        refreshTrigger={refreshTrigger}
        selectedChatId={selectedChatId}
        setShowModal={setShowModal} 
        logo={logo}
      />
      <Chat
        selectedChatId={selectedChatId}
        onNewChat={handleNewChat}
        refreshChats={triggerSidebarRefresh}
        showModal={showModal} 
        setShowModal={setShowModal}
        logo={logo}
        textGif={textGif}
      />
    </div>
  );
};

export default App;
