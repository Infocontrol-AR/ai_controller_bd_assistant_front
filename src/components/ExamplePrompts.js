import React, { useState, useEffect } from "react";

const prompts = [
  {
    label: "Empleados habilitados",
    prompt: "¿Cuántos empleados habilitados hay?",
  },
  {
    label: "Empleados inhabilitados",
    prompt:
      "Necesito un detalle de los empleados que los últimos 6 meses no fueron habilitados.",
  },
  {
    label: "Empresas habilitadas",
    prompt: "¿Cuántas empresas habilitadas existen en Argentina?",
  },
  {
    label: "Altas de AFIP",
    prompt: "¿Cuántas altas de AFIP fueron realizadas en los últimos 6 meses?",
  },
  {
    label: "Promedio de empleados habilitados",
    prompt:
      "¿Cuál es el promedio de empleados habilitados mensualmente en los últimos 6 meses?",
  },
  {
    label: "Documentos aprobados",
    prompt:
      "¿Cuáles y cuántos fueron los documentos más aprobados en los últimos 6 meses?",
  },
  {
    label: "Documentos rechazados",
    prompt:
      "¿Cuáles y cuántos fueron los documentos más rechazados en los últimos 6 meses?",
  },
  {
    label: "Empresas modo Integral",
    prompt:
      "¿Cuántas empresas están habilitadas para el tipo de servicio Integral?",
  },
  {
    label: "Empresas modo Renting",
    prompt:
      "¿Cuántas empresas están habilitadas para el tipo de servicio Renting?",
  },
  {
    label: "CUIT de empresas",
    prompt: "Quiero un detalle del CUIT de todas las empresas en Argentina.",
  },
  {
    label: "Empleado más Antigüo",
    prompt: "¿Cuál es el empleado más antigüo?",
  },
];

const ExamplePrompts = ({ onPromptClick }) => {
  const [currentPrompts, setCurrentPrompts] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const icons = [
    "bi-lightbulb",
    "bi-person",
    "bi-briefcase",
    "bi-clipboard",
    "bi-building",
  ];

  const getRandomPrompts = () => {
    const shuffled = prompts.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const getRandomIcon = () => {
    return icons[Math.floor(Math.random() * icons.length)];
  };

  useEffect(() => {
    setCurrentPrompts(getRandomPrompts());
    const intervalId = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPrompts(getRandomPrompts());
        setIsAnimating(false);
      }, 500);
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className={`example-prompts d-flex justify-content-around mt-3 ${
        isAnimating ? "fade" : ""
      }`}
    >
      {currentPrompts.map((item, idx) => (
        <div
          key={idx}
          className="text-center itemP"
          onClick={() => onPromptClick(item.prompt)}
        >
          <i
            className={`bi ${getRandomIcon()} mb-2`}
            style={{ fontSize: "30px", color: "#007bff" }}
          ></i>
          <h6 style={{ color: "#007bff", fontWeight: "bold" }}>{item.label}</h6>
          <p className="text-muted">{item.prompt}</p>
        </div>
      ))}
    </div>
  );
};

export default ExamplePrompts;
