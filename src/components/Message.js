import React from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';

const Message = ({ text, isUser, onCopy, onExport, onRefresh }) => (
  <div className={`message ${isUser ? 'user' : 'bot'}`}>
    <span dangerouslySetInnerHTML={{ __html: text }} />
    <div className="message-actions">
      {!isUser && (  // Mostrar botones solo si es un mensaje del bot
        <>
          <button onClick={onRefresh}>
            <i className="bi bi-arrow-clockwise" aria-label="refresh"></i> {/* Icono de refrescar */}
          </button>
          <button onClick={onCopy}>
            <i className="bi bi-clipboard" aria-label="copy"></i> {/* Icono de copiar */}
          </button>
          <button onClick={onExport}>
            <i className="bi bi-download" aria-label="export"></i> {/* Icono de exportar */}
          </button>
        </>
      )}
    </div>
  </div>
);

export default Message;
