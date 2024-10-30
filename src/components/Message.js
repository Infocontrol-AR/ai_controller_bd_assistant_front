import React from "react";

const Message = ({ text, isUser, onCopy }) => (
  <div className={`message ${isUser ? 'user' : 'bot'}`}>
    <span dangerouslySetInnerHTML={{ __html: text }} />
    <div className="message-actions">
      <button onClick={onCopy} className="btn btn-sm btn-outline-secondary" title="Copiar">
        <i className="bi bi-clipboard"></i>
      </button>
      {/* Aquí puedes añadir el botón de exportar más tarde */}
    </div>
  </div>
);

export default Message;
