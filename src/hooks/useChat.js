import { useState, useEffect, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

const useChat = (selectedChatId, onNewChat, refreshChats, logo, textGif) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [idChat, setIdChat] = useState(selectedChatId || null);
  const [quotedText, setQuotedText] = useState("");
  const [fileData, setFileData] = useState(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const setFile = (fileObject) => {
    //(fileObject);
    if (!fileObject || !fileObject.name || !fileObject.content) {
      Swal.fire({
        title: "Advertencia",
        text: "Documento no valido!",
        icon: "warning",
        confirmButtonText: "Aceptar",
      }); 
      return;
    }
    setFileData(fileObject);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() =>
      Swal.fire({
        title: "Exito",
        text: "Texto Copiado al portapapeles!",
        icon: "success",
        confirmButtonText: "Aceptar",
      })
    );
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
    setFileData(null);
  };

  const fetchChatHistory = useCallback(async (id_chat) => {
    setInputDisabled(true);
    setShowPrompts(false);

    try {
      const response = await fetch(
        `http://localhost:5000/chat/obtener-chat/${id_chat}`
      );
      const data = await response.json();
      console.log(data);
      setMessages(formatMessages(data));
    } catch {
      Swal.fire({
        title: "Error",
        text: "No se pudo cargar el historial. Por favor, inténtalo nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      resetChat();
    } finally {
      setLoading(false);
      setInputDisabled(false);
      setFileData(null);
    }
  }, []);

  const formatMessages = (history) =>
    history.map((item) => ({
      text: formatMessageText(item.content),
      isUser: item.sender === "user",
      responseSQL: item.responseSQL || null,
      onRefresh: item.onRefresh,
      created_at: item.created_at,
      files: item.files,
    }));

  const fetchApiData = async (prompt) => {
    if (!prompt) {
      Swal.fire({
        title: "Advertencia",
        text: "No se puede enviar una consulta vacia",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    const finalPrompt = quotedText
      ? `En relación a este contexto: \n \n ** ${quotedText} ** \n \n ${prompt}`
      : prompt;
    addMessage(finalPrompt, true);
    addMessage(
      `<img src=${textGif} alt="Descripción de la imagen" width="25">`,
      false,
      null,
      true
    );

    setLoading(true);
    setInputDisabled(true);
    setShowPrompts(false);

    try {
      //console.log(idChat);
      const response = await sendApiRequest(finalPrompt, fileData);
      console.log(response);
      handleApiResponse(response);
    } catch {
      addMessage(
        "Ocurrio un error, verifique su logica e intente nuevamente",
        false,
        finalPrompt
      );
    } finally {
      setFileData(null);
      setLoading(false);
      setInputDisabled(false);
      inputRef.current?.focus();
      setQuotedText("");
    }
  };

  const sendApiRequest = async (prompt, files = null) => {
    const body = {
      prompt,
      id_user: 1,
      id_chat: idChat,
      id_empresas: "5c339fb6-b458-11ec-9c2c-0e00717ac761",
      documents: [files],
    };

    if (!files) {
      body.documents = null;
    }

    //(body);
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
      setMessages(formatMessages(data.history.filter((m) => m.visible)));
    } 
    else {
      Swal.fire({
        title: "Error",
        text: "No se pudo cargar el historial. Por favor, inténtalo nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      resetChat();
    }
  };

  const addMessage = (
    message,
    isUser = true,
    OnRefreshError = null,
    preloader = false
  ) => {
    console.log(message, fileData);

    if (!message) return;

    if (OnRefreshError) {
      setMessages((prev) => [
        ...prev,
        {
          text: formatMessageText(message),
          isUser: false,
          error: true,
          onRefresh: formatMessageText(OnRefreshError),
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          preloader,
          text: isUser ? formatMessageText(message) : message,
          isUser,
          ...(fileData && { files: [fileData] }),
        },
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
      return Swal.fire({
        title: "Advertencia",
        text: "No hay nada para exportar",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });

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
    resetChat,
    setFile,
  };
};

export default useChat;
