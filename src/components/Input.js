import React, { useState, useEffect } from 'react';

const Input = ({ onSend, loading, inputRef }) => {
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            if (inputRef.current) {
                inputRef.current.style.height = 'auto';
            }
            onSend(input);
            setInput('');
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 96)}px`;
        }
    }, [input, inputRef]);

    return (
        <div className="input d-flex">
            <button className="btn btn-secondary me-2">
                <i className="bi bi-paperclip"></i>
            </button>
            <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe un mensaje..."
                className="form-control me-2"
                rows="1"
                style={{ resize: 'none' }}
            />
            <button onClick={handleSend} className="btn btn-primary" disabled={loading}>
                {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                    <i className="bi bi-send"></i>
                )}
            </button>
        </div>
    );
};

export default Input;
