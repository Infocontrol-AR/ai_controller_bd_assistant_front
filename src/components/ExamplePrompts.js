// src/components/ExamplePrompts.js
import React from 'react';

const prompts = [
    { label: 'Ver empleados', prompt: 'Quiero ver una lista de empleados' },
    { label: 'Ver empresas', prompt: 'Quiero ver una lista de empresas' },
    { label: 'Ultimo documento cargado', prompt: '¿Cual es el ultimo documento cargado y su estado?' }
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
