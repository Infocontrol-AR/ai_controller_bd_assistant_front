import React, { useState, useEffect } from "react";

const prompts = [
  {
    label: "Empleados habilitados",
    prompt: "¿Cuántos empleados habilitados hay?",
  },
  {
    label: "Fecha de habilitación",
    prompt: "¿En qué fecha fue habilitado el empleado?",
  },
  {
    label: "Empleados no habilitados",
    prompt:
      "Necesito un detalle de los empleados que para un periodo no fueron habilitados, indicando nombre, RUT y documentos pendientes de habilitación.",
  },
  {
    label: "Empresas habilitadas",
    prompt: "¿Cuántas empresas habilitadas existen en el grupo?",
  },
  {
    label: "Altas de AFIP",
    prompt: "¿Cuántas altas de AFIP fueron realizadas en los últimos 6 meses?",
  },
  {
    label: "Promedio de empleados habilitados",
    prompt:
      "¿Cuál es el promedio de empleados habilitados mensualmente en los últimos 12 meses?",
  },
  {
    label: "Documentos aprobados",
    prompt:
      "¿Cuáles y cuántos fueron los documentos más aprobados en los últimos 3 meses?",
  },
  {
    label: "Documentos rechazados",
    prompt:
      "¿Cuáles y cuántos fueron los documentos más rechazados en los últimos 3 meses?",
  },
  {
    label: "Empresas en Argentina",
    prompt:
      "¿Cuántas empresas están habilitadas en Argentina para el tipo de servicio integral?",
  },
  {
    label: "CUIT de empresas",
    prompt: "Quiero un detalle del CUIT de todas las empresas en Argentina.",
  },
  {
    label: "Rubros de empresas",
    prompt:
      "Quiero conocer los principales rubros de las empresas que contratan el servicio integral con las respectivas cantidades.",
  },
  {
    label: "Apoderado firmante",
    prompt:
      "¿Cuál es el nombre del apoderado firmante en los últimos contratos cargados y cuál es la vigencia del poder o personería que se invoca?",
  },
  {
    label: "Convenio de trabajo",
    prompt: "¿Qué convenio de trabajo aplica a los empleados?",
  },
  {
    label: "Categorías de empleados",
    prompt: "¿Cuáles son las principales categorías de los empleados?",
  },
  {
    label: "Empleados nocturnos",
    prompt:
      "¿Cuántos y quiénes son los empleados que realizan horario nocturno?",
  },
  {
    label: "Antigüedad del empleado",
    prompt: "¿Cuál es la antigüedad del empleado?",
  },
  {
    label: "Ubicaciones físicas",
    prompt:
      "Quiero conocer en detalle las ubicaciones físicas de los empleados que ingresaron durante el último año para cumplir sus tareas.",
  },
  {
    label: "Categoría más contratada",
    prompt:
      "¿Qué categoría de empleados fue la que más se contrató en el último año?",
  },
  {
    label: "Contratos próximos a vencer",
    prompt:
      "Quiero saber cuántos contratos a tiempo determinado se encuentran próximos a vencer en los próximos dos meses.",
  },
];

const ExamplePrompts = ({ onPromptClick }) => {
  const [currentPrompts, setCurrentPrompts] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const getRandomPrompts = () => {
    const shuffled = prompts.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  useEffect(() => {
    setCurrentPrompts(getRandomPrompts());
    const intervalId = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPrompts(getRandomPrompts());
        setIsAnimating(false);
      }, 500);
    }, 7000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className={`example-prompts d-flex justify-content-between mt-3 ${
        isAnimating ? "fade" : ""
      }`}
    >
      {currentPrompts.map((item, idx) => (
        <button
          key={idx}
          className="btn btn-outline-secondary btn-sm d-flex align-items-center"
          onClick={() => onPromptClick(item.prompt)}
        >
          <i className="bi bi-lightbulb me-2"></i>
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default ExamplePrompts;
