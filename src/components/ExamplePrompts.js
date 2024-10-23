// src/components/ExamplePrompts.js
import React from 'react';

const prompts = [
    { label: 'Ver empleados', prompt: 'Quiero ver 10 empleados' },
    { label: 'Último contratista añadido', prompt: '¿Quién fue el último contratista añadido?' },
    { label: '¿Por qué se rechazó mi documento?', prompt: '¿Por qué se rechazó mi documento?' }
];

const ExamplePrompts = ({ onPromptClick }) => {
    return (
        <div className="example-prompts d-flex justify-content-between mt-3">
            {prompts.map((item, idx) => (
                <button
                    key={idx}
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                    onClick={() => onPromptClick(item.prompt)}
                >
                    <i className="bi bi-lightbulb me-2"></i> {}
                    {item.label}
                </button>
            ))}
        </div>
    );
};

export default ExamplePrompts;
