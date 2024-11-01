import React from 'react';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar'; // Importa el nuevo componente Sidebar

const App = () => {
    return (
        <div className="app">
            <Sidebar /> {/* Añade el Sidebar */}
            <Chat />
        </div>
    );
};

export default App;
