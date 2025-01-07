import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';
import logo from "./infocontrol.png";
import textGif from "./text.gif";

const App = () => {
  const [searchParams] = useSearchParams();
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [decodedParams, setDecodedParams] = useState({});

  //http://localhost:3000/?s=IntcclxuICBpZF9lbXByZXNhczogJzVjMzM5ZmI2LWI0NTgtMTFlYy05YzJjLTBlMDA3MTdhYzc2MScsXHJcbiAgaWRfdXNlcjogJycsXHJcbiAgaWRfc2Vzc2lvbjogJycsXHJcbiAgcm9sOiAnJyxcclxuICB0b2tlbl9zaXN0ZW1hOiAnJ1xyXG59Ig==

  useEffect(() => {
    const encodedS = searchParams.get('s');
    if (encodedS) {
      try {
        const decodedS = atob(encodedS);
        const parsedParams = JSON.parse(JSON.stringify(decodedS)); 
        setDecodedParams(parsedParams); 
        console.log(JSON.parse(decodedS));
      } catch (error) {
        console.error('Error al decodificar o parsear el parámetro "s":', error);
      }
    }
  }, [searchParams]);

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
