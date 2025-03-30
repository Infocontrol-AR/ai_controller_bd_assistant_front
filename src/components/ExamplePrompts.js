import React, { useState, useEffect } from "react";

const prompts = [
  {
    label: "Top 10 suppliers",
    prompt: "Detailed list of the 10 suppliers with the highest amount of approved documentation.",
  },
  {
    label: "Expired documentation",
    prompt: "List of suppliers with the highest amount of expired documentation in the last 30 days.",
  },
  {
    label: "Rejected document types",
    prompt: "Identify the most frequently rejected types of documents.",
  },
  {
    label: "Contractor ranking",
    prompt: "Ranking from 1 to 10 of contractors based on their documentary compliance.",
  },
  {
    label: "Authorized employees",
    prompt: "List of contractors with the highest number of authorized employees.",
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
    "bi-bar-chart",
    "bi-graph-up",
    "bi-pie-chart",
    "bi-people",
    "bi-gear",
    "bi-calendar",
    "bi-cash",
    "bi-credit-card",
    "bi-file-earmark",
    "bi-folder",
    "bi-globe",
    "bi-handshake",
    "bi-laptop",
    "bi-phone",
    "bi-printer",
    "bi-receipt",
    "bi-shield",
    "bi-wallet",
    "bi-wrench",
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
