import React from 'react';
import ChatInterface from './components/ChatInterface';

function App() {
    return (
        <div className="min-h-screen flex bg-black">
            {/* Sidebar could go here in future */}
            <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full bg-black shadow-xl my-4 rounded-xl overflow-hidden border border-gray-800">
                <ChatInterface />
            </div>
        </div>
    );
}

export default App;
