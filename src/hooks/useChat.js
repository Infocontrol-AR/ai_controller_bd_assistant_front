import { useState, useEffect, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import logo from "../infocontrol.png";

const useChat = (selectedChatId, onNewChat, refreshChats) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [idChat, setIdChat] = useState(selectedChatId || null);
  const [quotedText, setQuotedText] = useState("");
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Texto copiado al portapapeles"));
  };

  useEffect(() => {
    if (!selectedChatId) return resetChat();
    setIdChat(selectedChatId);
    fetchChatHistory(selectedChatId);
  }, [selectedChatId]);

  const resetChat = () => {
    setMessages([]);
    setIdChat(null);
    setShowPrompts(true);
  };

  const fetchChatHistory = useCallback(async (id_chat) => {
   // console.log(id_chat);
    setLoading(true);
    setInputDisabled(true);
    setShowPrompts(false);

    try {
      const response = await fetch(
        `http://localhost:5000/chat/obtener-chat/${id_chat}`
      );
      const data = await response.json();
     // console.log(data);
      setMessages(formatMessages(data));
    } catch {
      // alert("Error al cargar el historial.");
      // resetChat();
    } finally {
      setLoading(false);
      setInputDisabled(false);
    }
  }, []);

  const formatMessages = (history) =>
    history.map((item) => ({
      text: formatMessageText(item.content),
      isUser: item.sender === "user",
      responseSQL: item.responseSQL || null,
      onRefresh: item.onRefresh,
    }));

  const fetchApiData = async (prompt) => {
    if (!prompt) return alert("No se puede enviar un Mensaje Vacio");

    const finalPrompt = quotedText
      ? `En relación a este contexto: \n \n **${quotedText}** \n \n ${prompt}`
      : prompt;
    addMessage(finalPrompt, true);
    setLoading(true);
    setInputDisabled(true);
    setShowPrompts(false);

    try {
      //console.log(idChat);
      const response = await sendApiRequest(finalPrompt);
     console.log(response);
      handleApiResponse(response);
    } catch {
      addMessage(
        "Ocurrio un error, verifique su logica e intente nuevamente",
        false,
        finalPrompt
      );
    } finally {
      setLoading(false);
      setInputDisabled(false);
      inputRef.current?.focus();
      setQuotedText("");
    }
  };

  const sendApiRequest = async (prompt) => {
    const body = { prompt, id_user: 1, id_chat: idChat, id_empresas: '5c339fb6-b458-11ec-9c2c-0e00717ac761'};
   // console.log(body);
    const response = await fetch("http://localhost:5000/chat/enviar-mensaje", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return response.json();
  };

  const handleApiResponse = (data) => {
    if (data.id_chat && !idChat) {
      setIdChat(data.id_chat);
      onNewChat(data.id_chat);
      refreshChats();
    }

    if (data.history) {
      setMessages(formatMessages(data.history.filter(m => m.visible)));
    } else {
      alert("Error al cargar el historial.");
      resetChat();
    }
  };

  const addMessage = (message, isUser = true, OnRefreshError = null) => {
    if (!message) return;

    if (OnRefreshError) {
      setMessages((prev) => [
        ...prev,
        { text: formatMessageText(OnRefreshError), isUser: true, error: true },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { text: formatMessageText(message), isUser },
      ]);
    }
  };

  const formatMessageText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
  };

  const exportToExcel = async (responseSQL) => {
    if (!Array.isArray(responseSQL) || responseSQL.length === 0)
      return alert("No se puede exportar un elemento vacío.");

    setExporting(true);
    const worksheet = XLSX.utils.json_to_sheet(responseSQL);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    formatExcelColumns(worksheet, responseSQL);
    const fileName = `export_${new Date()
      .toLocaleTimeString()
      .replace(/:/g, "_")}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    setExporting(false);
  };

  const formatExcelColumns = (worksheet, responseSQL) => {
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
        if (row === 1)
          worksheet[key].v = worksheet[key].v.toUpperCase().replace(/_/g, " ");
      }
    });
  };

  const handleQuote = (text) => {
    setQuotedText(text);
    inputRef.current?.focus();
  };

  useEffect(() => {
    inputRef.current?.focus();
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return {
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
    logo,
    copyToClipboard,
  };
};

export default useChat;
