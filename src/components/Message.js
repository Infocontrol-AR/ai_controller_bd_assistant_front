import React from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import PropTypes from 'prop-types';

const Message = ({ text, isUser, onCopy, onExport, onRefresh }) => (
  <div className={`message ${isUser ? 'user' : 'bot'}`}>
    <span dangerouslySetInnerHTML={{ __html: text }} />
    <div className="message-actions">
      {!isUser && ( 
        <>
          <button onClick={onRefresh}>
            <i className="bi bi-arrow-clockwise" aria-label="refresh"></i>
          </button>
          <button onClick={onCopy}>
            <i className="bi bi-clipboard" aria-label="copy"></i>
          </button>
          <button onClick={onExport}>
            <i className="bi bi-download" aria-label="export"></i>
          </button>
        </>
      )}
    </div>
  </div>
);

Message.propTypes = {
  text: PropTypes.string.isRequired,
  isUser: PropTypes.bool.isRequired,
  onCopy: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default Message;
