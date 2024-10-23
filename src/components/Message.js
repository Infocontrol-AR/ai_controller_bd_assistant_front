// src/components/Message.js
import React from "react";

const Message = ({ text, isUser }) => (
  <div className={`message ${isUser ? 'user' : 'bot'}`}>
    {isUser ? (
      <span>{text}</span>
    ) : (
      <span dangerouslySetInnerHTML={{ __html: text }} />
    )}
  </div>
);

export default Message;
