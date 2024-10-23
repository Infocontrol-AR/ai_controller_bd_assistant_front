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

  const addMessage = (message, isUser = true) =>
    setMessages((prev) => [...prev, { text: message, isUser }]);

  const arrayToTable = (array) => {
    if (
      !Array.isArray(array) ||
      array.length === 0 ||
      typeof array[0] !== "object"
    ) {
      return "<p>El array proporcionado no es válido o está vacío.</p>";
    }

    const headers = Object.keys(array[0]);
    const headerRow = `<tr>${headers
      .map((key) => `<th>${key}</th>`)
      .join("")}</tr>`;
    const bodyRows = array
      .map(
        (obj) =>
          `<tr>${headers
            .map((key) => `<td>${obj[key] || ""}</td>`)
            .join("")}</tr>`
      )
      .join("");

    return `<table border="1"><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`;
  };

  const fetchApiData = async (prompt) => {
    addMessage(prompt);
    setLoading(true);

    let data;

    try {
      const response = await fetch(
        "https://regards-inns-compression-cgi.trycloudflare.com/bot/chat/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!response.ok) {
        data = {
          response: [
            {
              apellido: "PACHECO GODOY",
              nombre: "ANTONIO LEONIDAS",
            },
            {
              apellido: "PACHECO GODOY2",
              nombre: "ANTONIO LEONIDAS",
            },
            {
              apellido: "PACHECO GODOY3",
              nombre: "ANTONIO LEONIDAS",
            },
          ],
        };
      } else {
        data = await response.json();
      }

      if (
        Array.isArray(data.response) &&
        data.response.length > 0 &&
        typeof data.response[0] === "object"
      ) {
        const tableHtml = arrayToTable(data.response);
        addMessage(tableHtml, false);
      } else {
        addMessage(JSON.stringify(data.response), false);
      }
    } catch (e) {
      data = {
        response: [
          {
            apellido: "PACHECO GODOY",
            nombre: "ANTONIO LEONIDAS",
          },
          {
            apellido: "PACHECO GODOY2",
            nombre: "ANTONIO LEONIDAS",
          },
          {
            apellido: "PACHECO GODOY3",
            nombre: "ANTONIO LEONIDAS",
          },
        ],
      };
      if (
        Array.isArray(data.response) &&
        data.response.length > 0 &&
        typeof data.response[0] === "object"
      ) {
        const tableHtml = arrayToTable(data.response);
        addMessage(tableHtml, false);
      } else {
        addMessage(JSON.stringify(data.response), false);
      }
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
          <Message key={idx} text={msg.text} isUser={msg.isUser} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <Input onSend={fetchApiData} loading={loading} inputRef={inputRef} />
      {showPrompts && <ExamplePrompts onPromptClick={fetchApiData} />}{" "}
      {}
    </div>
  );
};

export default Chat;
