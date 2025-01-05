import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import PropTypes from "prop-types";

const Message = ({
  preloader,
  text,
  isUser,
  onCopy,
  onExport,
  onRefresh,
  onQuote,
  created_at,
  files,
}) => {
  const [selectedText, setSelectedText] = useState("");
  const [showQuoteIcon, setShowQuoteIcon] = useState(false);
  const [iconPosition, setIconPosition] = useState({ top: 0, left: 0 });

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const text = selection.toString();
      if (text) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectedText(text);
        setShowQuoteIcon(true);
        setIconPosition({
          top: rect.top + window.scrollY - 30,
          left: rect.left + window.scrollX + rect.width / 2 - 10,
        });
      }
    } else {
      setShowQuoteIcon(false);
    }
  };

  const handleClickQuoteIcon = (event) => {
    event.stopPropagation();
    onQuote(selectedText);
    setShowQuoteIcon(false);
    setSelectedText("");
  };

  const handleClickOutside = (event) => {
    const selection = window.getSelection();
    if (!selection.toString()) {
      setShowQuoteIcon(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("click", handleClickOutside);
      setSelectedText("");
    };
  }, []);

  //(files);

  return (
    <div
      className={`message ${isUser ? "user" : "bot"}`}
      style={{
        maxWidth: preloader ? "min-content" : "50%",
      }}
    >
      {files && files.length > 0 && (
        <>
          <span style={{ color: "gray" }}>{files[0].name}</span>
          <hr />
        </>
      )}

      <span dangerouslySetInnerHTML={{ __html: text }} />
      {showQuoteIcon && (
        <i
          className="bi bi-quote"
          style={{
            position: "absolute",
            top: `${iconPosition.top}px`,
            left: `${iconPosition.left}px`,
            cursor: "pointer",
            zIndex: 1000,
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
            transition: "background 0.3s, transform 0.3s",
          }}
          onClick={handleClickQuoteIcon}
          aria-label="Quote selected text"
        />
      )}
      <div
        className="message-actions"
        style={{
          display: "flex",
          justifyContent: !isUser ? "space-between" : "flex-end",
          marginTop: "10px",
          position: "relative",
        }}
      >
        {!preloader && (
          <div
          className="datetime"
          style={{
            display: "flex",
            alignItems: "center",
            color: "#bdbdbd",
          }}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: new Date(created_at || Date.now()).toLocaleTimeString(
                "es-AR",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }
              ),
            }}
          />
        </div>
        )}

        {!isUser && !preloader && (
          <>
            <div
              className="actions-btn"
              style={{
                display: "flex",
                gap: "5px",
                backgroundColor: "#007bff",
                borderRadius: "5px",
                padding: "2px",
                position: "absolute",
                right: "0",
                bottom: "-25px",
              }}
            >
              <button onClick={onRefresh}>
                <i className="bi bi-arrow-clockwise" aria-label="refresh"></i>
              </button>
              <button onClick={onCopy}>
                <i className="bi bi-clipboard" aria-label="copy"></i>
              </button>
              <button onClick={onExport}>
                <i className="bi bi-download" aria-label="export"></i>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Message;
