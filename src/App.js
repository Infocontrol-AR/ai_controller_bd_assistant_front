import React, { useState } from 'react';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';

const App = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Estado para forzar actualización de Sidebar

  const handleChatSelect = (id_chat) => {
    setSelectedChatId(id_chat);
  };

  const handleNewChat = (newIdChat) => {
    setSelectedChatId(newIdChat);
    triggerSidebarRefresh(); // Fuerza la actualización de Sidebar cuando se crea un nuevo chat
  };

  const triggerSidebarRefresh = () => {
    setRefreshTrigger((prev) => prev + 1); // Cambia el valor para forzar la actualización en Sidebar
  };

  return (
    <div className="app">
      <Sidebar onSelectChat={handleChatSelect} refreshTrigger={refreshTrigger} />
      <Chat selectedChatId={selectedChatId} onNewChat={handleNewChat} refreshChats={triggerSidebarRefresh} />
    </div>
  );
};

export default App;
