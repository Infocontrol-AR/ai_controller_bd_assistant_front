import React, { useState, useEffect } from "react";

const Input = ({
  onSend,
  loading,
  inputRef,
  disabled,
  quotedText,
  onNewChat,
  onSendFile,
}) => {
  const [input, setInput] = useState("");
  const [showQuoteContainer, setShowQuoteContainer] = useState(false);
  const [buttonClass, setButtonClass] = useState("btn-secondary");
  const [fileAttached, setFileAttached] = useState(false); // Estado para controlar si hay un archivo
  const [fileName, setFileName] = useState(""); // Estado para almacenar el nombre del archivo

  useEffect(() => {
    if (quotedText || fileAttached) {  // Mostrar el quote-container si hay una cita o archivo
      setShowQuoteContainer(true);
    } else {
      setShowQuoteContainer(false);
    }
  }, [quotedText, fileAttached]); // Dependencias: actualiza cuando quotedText o fileAttached cambian

  const handleSend = () => {
    if (input.trim() || fileAttached) {
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
      onSend(input);
      setInput("");
      setShowQuoteContainer(false);
      setFileAttached(false); // Reiniciar el estado del archivo después de enviar
      setFileName(""); // Limpiar el nombre del archivo
      setButtonClass("btn-secondary"); // Reiniciar el estado del botón
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 96)}px`;
    }
  }, [input, inputRef]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Solo está permitido un archivo por mensaje");
      setFileAttached(false);
      return;
    }

    const allowedFormats = [
      "image/jpeg",
      "image/png",
      "image/gif",
    ];

    if (!allowedFormats.includes(file.type)) {
      alert("Formato de archivo no permitido.");
      setFileAttached(false);
      return;
    }

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });

    try {
      const base64Content = await toBase64(file);
      onSendFile({ name: file.name, content: base64Content });
      setFileAttached(true); // Cambiar el estado cuando se adjunta un archivo válido
      setFileName(file.name); // Almacenar el nombre del archivo
    } catch (error) {
      console.error("Error al convertir el archivo a Base64:", error);
      setFileAttached(false);
    }

    e.target.value = ""; // Limpiar el valor del input de archivo
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    setButtonClass(value.trim() || fileAttached ? "btn-primary" : "btn-secondary");
  };

  return (
    <div className="input">
      {showQuoteContainer && (
        <div className="quote-container d-flex align-items-center justify-content-between">
          <span>{quotedText ? `"${quotedText}"` : fileName}</span> {/* Muestra cita o nombre del archivo */}
          <button className="btn-close" onClick={() => {
            setShowQuoteContainer(false);
            setFileAttached(false); // Si se cierra el contenedor de la cita, se elimina el archivo
            setFileName(""); // Limpiar nombre del archivo
          }}>
            <i className="bi bi-x"></i>
          </button>
        </div>
      )}
      <div className="d-flex align-items-center">
        {/* Botón Nuevo Chat */}
        <button className="btn btn-secondary me-2 circle-btn d-flex align-items-center" onClick={onNewChat}>
          <i className="bi bi-plus-circle-fill"></i>
          <span className="ms-2">New Chat</span>
        </button>

        {/* Botón Micrófono */}
        <button className="btn btn-secondary me-2" style={{ borderRadius: "45%" }}>
          <i className="bi bi-mic"></i>
        </button>

        {/* Botón Clip */}
        <label
          className={`btn ${fileAttached ? "btn-primary" : "btn-secondary"} me-2`}
          style={{ borderRadius: "45%", cursor: "pointer" }}
        >
          <i className="bi bi-paperclip"></i>
          <input
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
            disabled={disabled}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpeg,.jpg,.png,.gif"
          />
        </label>

        {/* Input de texto */}
        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="form-control me-2"
          rows="1"
          style={{ resize: "none" }}
          disabled={disabled}
        />

        {/* Botón Enviar */}
        <button
          onClick={handleSend}
          className={`btn ${buttonClass} me-2`}
          disabled={loading || disabled || (!input.trim() && !fileAttached)} // Deshabilitar si no hay texto o archivo
          style={{ borderRadius: "45%" }}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            <i className="bi bi-send"></i>
          )}
        </button>
      </div>
    </div>
  );
};

export default Input;
