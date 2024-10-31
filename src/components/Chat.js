import React, { useEffect, useState, useRef } from "react";
import Input from "./Input";
import logo from "../infocontrol.png";
import Message from "./Message";
import ExamplePrompts from "./ExamplePrompts";
import * as XLSX from "xlsx";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showPrompts, setShowPrompts] = useState(true);

  const addMessage = (message, isUser = true, responseSQL = null, prompt = null) => {
    const originalMessage = message;
    const formattedMessage = message
      .replace(/\n/g, "<br/>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    setMessages((prev) => [
      ...prev,
      { text: formattedMessage, isUser, originalMessage, responseSQL, prompt },
    ]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Texto copiado al portapapeles");
    });
  };

  const fetchApiData = async (prompt) => {
    addMessage(prompt);
    setLoading(true);
    setInputDisabled(true);

    let data;

    try {
      const response = await fetch("http://localhost:5000/bot/chat_v3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      data = await response.json();
      console.log(data);
      addMessage(data.responseIA, false, data.responseSQL, prompt);
    } catch (e) {
      console.log(e);
      addMessage('Verifique la logica de su consulta e intente nuevamente', false, []);
    } finally {
      setLoading(false);
      setInputDisabled(false);
      inputRef.current?.focus();
      setShowPrompts(false);
    }
  };

  const handleRefresh = (prompt) => {
    fetchApiData(prompt);
  };

  const exportToExcel = async (responseSQL) => {
    if (!responseSQL || !Array.isArray(responseSQL) || responseSQL.length === 0) {
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

    for (let R = range.s.r; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellRef];
        if (cell) {
          cell.s = {
            alignment: { horizontal: "center", vertical: "center" },
          };
        }
      }
    }

    Object.keys(worksheet).forEach((key) => {
      if (key.startsWith("!")) return;
      const row = parseInt(key.match(/\d+/)[0], 10);
      if (row === 1) {
        worksheet[key].v = worksheet[key].v.toUpperCase().replace(/_/g, " ");
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
            onCopy={() => copyToClipboard(msg.originalMessage)}
            onExport={() => exportToExcel(msg.responseSQL)}
            onRefresh={() => handleRefresh(msg.prompt)} // Usar el prompt almacenado
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
