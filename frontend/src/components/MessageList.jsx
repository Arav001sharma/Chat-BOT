import React from 'react';

const MessageList = ({ messages }) => {
    const formatTimestamp = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderMessageContent = (message) => {
        if (message.data) {
            return (
                <div>
                    <p className="mb-2 whitespace-pre-wrap">{message.text}</p>
                    {message.data.table && (
                        <div className="overflow-x-auto mt-2">
                            <table className="min-w-full bg-neutral-900 border border-gray-800 text-sm shadow-sm rounded-lg overflow-hidden">
                                <thead className="bg-neutral-800">
                                    <tr>
                                        {Object.keys(message.data.table[0] || {}).map(key => (
                                            <th key={key} className="px-3 py-2 border-b border-gray-700 text-left font-semibold text-gray-200">
                                                {key}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {message.data.table.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-neutral-800 border-b border-gray-800 last:border-0 text-gray-300">
                                            {Object.values(row).map((val, i) => (
                                                <td key={i} className="px-3 py-2 border-r border-gray-800 last:border-r-0">
                                                    {val}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            );
        }
        return <p className="whitespace-pre-wrap">{message.text}</p>;
    };

    return (
        <div className="flex flex-col space-y-4">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div
                        className={`max-w-3xl rounded-lg p-4 shadow-sm ${message.type === 'user'
                            ? 'bg-white text-black rounded-br-none'
                            : message.type === 'error'
                                ? 'bg-red-900/50 text-red-200 rounded-bl-none border border-red-800'
                                : 'bg-neutral-900 text-gray-100 border border-gray-800 rounded-bl-none'
                            }`}
                    >
                        {renderMessageContent(message)}
                        <span className={`text-xs mt-2 block ${message.type === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                            {formatTimestamp(message.timestamp)}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessageList;
