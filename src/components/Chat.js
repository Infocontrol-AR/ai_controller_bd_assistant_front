//Chat.js
import React from "react";
import Input from "./Input";
import Message from "./Message";
import ExamplePrompts from "./ExamplePrompts";
import useChat from "../hooks/useChat";

const Chat = ({ selectedChatId, onNewChat, refreshChats, logo }) => {
  const {
    messages,
    loading,
    exporting,
    inputDisabled,
    showPrompts,
    quotedText,
    inputRef,
    messagesEndRef,
    fetchApiData,
    addMessage,
    exportToExcel,
    handleQuote,
    handleError,
    copyToClipboard,
    resetChat,
    setFile
  } = useChat(selectedChatId, onNewChat, refreshChats, logo);

  return (
    <div className="chat">
      <img
        src={logo}
        alt="Logo"
        className={`logo ${messages.length ? "small-logo" : ""}`}
      />
      {showPrompts && <ExamplePrompts onPromptClick={fetchApiData} />}

      <div className="messages">
        {messages.map((msg, idx) => (
          <Message
            key={idx}
            text={msg.text}
            isUser={msg.isUser}
            created_at={msg.created_at}
            onCopy={() => copyToClipboard(msg.text)}
            onExport={() => exportToExcel(msg.responseSQL)}
            onRefresh={() => fetchApiData(msg.onRefresh)}
            onQuote={handleQuote}
            files={msg.files}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <Input
        onSend={(prompt) => fetchApiData(prompt, null)}
        onSendFile={setFile}
        loading={loading}
        inputRef={inputRef}
        disabled={inputDisabled}
        quotedText={quotedText}
        onNewChat={resetChat}
      />
    </div>
  );
};

export default Chat;
