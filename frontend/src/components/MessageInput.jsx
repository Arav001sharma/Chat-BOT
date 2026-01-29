import React, { useState } from 'react';
import { Send } from 'lucide-react';

const MessageInput = ({ onSendMessage, disabled }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-black border-t border-gray-800 p-4">
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question about holdings or trades..."
                    disabled={disabled}
                    className="flex-1 px-4 py-2 bg-neutral-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-neutral-800 disabled:text-gray-500 placeholder-gray-500"
                />
                <button
                    type="submit"
                    disabled={disabled || !input.trim()}
                    className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 disabled:bg-neutral-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                    <Send className="w-4 h-4 mr-2" />
                    Send
                </button>
            </div>
        </form>
    );
};

export default MessageInput;
