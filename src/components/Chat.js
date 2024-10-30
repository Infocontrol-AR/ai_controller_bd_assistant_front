import React, { useEffect, useState, useRef } from "react";
import Input from "./Input";
import logo from "../infocontrol.png";
import Message from "./Message";
import ExamplePrompts from "./ExamplePrompts";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showPrompts, setShowPrompts] = useState(true);

  const addMessage = (message, isUser = true) => {
    // Guardar el mensaje original para copiarlo sin etiquetas HTML
    const originalMessage = message;
    const formattedMessage = message.replace(/\n/g, "<br/>");
    setMessages((prev) => [...prev, { text: formattedMessage, isUser, originalMessage }]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log("Texto copiado al portapapeles");
    });
  };

  const fetchApiData = async (prompt) => {
    addMessage(prompt);
    setLoading(true);

    let data;

    try {
      const response = await fetch(
        "http://localhost:5000/bot/chat_v3",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        }
      );

      data = await response.json();
      addMessage(data.responseIA, false);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
      setShowPrompts(false);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
            onCopy={() => copyToClipboard(msg.originalMessage)} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <Input onSend={fetchApiData} loading={loading} inputRef={inputRef} />
      {showPrompts && <ExamplePrompts onPromptClick={fetchApiData} />}
    </div>
  );
};

export default Chat;
