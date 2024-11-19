//Chat.js
import React from "react";
import Input from "./Input";
import Message from "./Message";
import ExamplePrompts from "./ExamplePrompts";
import useChat from "../hooks/useChat";

const Chat = ({ selectedChatId, onNewChat, refreshChats }) => {
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
    logo,
    copyToClipboard
  } = useChat(selectedChatId, onNewChat, refreshChats);

  return (
    <div className="chat">
      <img
        src={logo}
        alt="Logo"
        className={`logo ${messages.length ? "small-logo" : ""}`}
      />
      <div className="messages">
        {messages.map((msg, idx) => (
          <Message
            key={idx}
            text={msg.text}
            isUser={msg.isUser}
            onCopy={() => copyToClipboard(msg.text)}
            onExport={() => exportToExcel(msg.responseSQL)}
            onRefresh={() => fetchApiData(msg.onRefresh)}
            onQuote={handleQuote}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <Input
        onSend={fetchApiData}
        loading={loading}
        inputRef={inputRef}
        disabled={inputDisabled}
        quotedText={quotedText}
      />
      {showPrompts && <ExamplePrompts onPromptClick={fetchApiData} />}
    </div>
  );
};

export default Chat;
