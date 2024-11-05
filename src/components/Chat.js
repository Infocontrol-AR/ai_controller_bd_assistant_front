import React, { useEffect, useState, useRef } from "react";
import Input from "./Input";
import logo from "../infocontrol.png";
import Message from "./Message";
import ExamplePrompts from "./ExamplePrompts";
import * as XLSX from "xlsx";

const Chat = ({ selectedChatId, onNewChat, refreshChats }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showPrompts, setShowPrompts] = useState(true);
  const [idChat, setIdChat] = useState(selectedChatId || null);

  useEffect(() => {
    if (selectedChatId === null) {
      setMessages([]);
      setIdChat(null);
      setShowPrompts(true);
      return;
    }

    if (selectedChatId) {
      setIdChat(selectedChatId);
      fetchChatHistory(selectedChatId);
    } else {
      setMessages([]);
    }
  }, [selectedChatId]);

  const fetchChatHistory = async (id_chat) => {
    setLoading(true);
    setInputDisabled(true);
    setShowPrompts(false);

    try {
      const response = await fetch(
        `http://localhost:5000/chat/obtener-chat/${id_chat}`
      );
      const data = await response.json();
      const formattedMessages = data[0].history.map((item) => ({
        text: item.content
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\n/g, "<br/>"),
        isUser: item.role === "user",
        responseSQL: item.responseSQL || null,
        onRefresh: item.onRefresh,
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error al cargar el historial:", error);
      addMessage("Error al cargar el historial. Intente nuevamente.", false);
    } finally {
      setLoading(false);
      setInputDisabled(false);
    }
  };

  const fetchApiData = async (prompt) => {
    addMessage(prompt, true);
    setLoading(true);
    setInputDisabled(true);
    setShowPrompts(false);

    try {
      const response = await fetch(
        "http://localhost:5000/chat/enviar-mensaje",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, id_user: 1, id_chat: idChat }),
        }
      );

      const data = await response.json();

      if (data.id_chat && !idChat) {
        setIdChat(data.id_chat);
        onNewChat(data.id_chat);
        refreshChats();
      }

      if (data.history) {
        const formattedMessages = data.history.map((item) => ({
          text: item.content
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\n/g, "<br/>"),
          isUser: item.role === "user",
          responseSQL: item.responseSQL || null,
          onRefresh: item.onRefresh,
        }));
        setMessages(formattedMessages);
      } else if (data.error) {
        addMessage(
          "Verifique la lógica de su consulta e intente nuevamente",
          false
        );
      }
    } catch {
      addMessage(
        "Error en la comunicación con el servidor. Intente nuevamente.",
        false
      );
    } finally {
      setLoading(false);
      setInputDisabled(false);
      inputRef.current?.focus();
    }
  };

  const addMessage = (message, isUser = true) => {
    if (!message) return;
    setMessages((prev) => [...prev, { text: message, isUser }]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Texto copiado al portapapeles"));
  };

  const exportToExcel = async (responseSQL) => {
    if (!Array.isArray(responseSQL) || responseSQL.length === 0) {
      alert("No se puede exportar un elemento vacío.");
      return;
    }

    setExporting(true);
    const worksheet = XLSX.utils.json_to_sheet(responseSQL);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let col = range.s.c; col <= range.e.c; col++) {
      const columnWidth = Math.max(
        ...responseSQL.map((row) => String(row[Object.keys(row)[col]]).length),
        10
      );
      worksheet["!cols"] = worksheet["!cols"] || [];
      worksheet["!cols"][col] = { wch: columnWidth + 2 };
    }

    Object.keys(worksheet).forEach((key) => {
      if (!key.startsWith("!")) {
        const row = parseInt(key.match(/\d+/)[0], 10);
        if (row === 1) {
          worksheet[key].v = worksheet[key].v.toUpperCase().replace(/_/g, " ");
        }
      }
    });

    const date = new Date();
    const fileName = `export_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    setExporting(false);
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
            onCopy={() => copyToClipboard(msg.text)}
            onExport={() => exportToExcel(msg.responseSQL)}
            onRefresh={() => fetchApiData(msg.onRefresh)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <Input
        onSend={fetchApiData}
        loading={loading}
        inputRef={inputRef}
        disabled={inputDisabled}
      />
      {showPrompts && <ExamplePrompts onPromptClick={fetchApiData} />}
    </div>
  );
};

export default Chat;
