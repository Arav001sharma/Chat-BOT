import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import QuickQuestions from './QuickQuestions';
import DataVisualization from './DataVisualization';
import { sendMessage, initializeData } from '../services/api';

const ChatInterface = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [visualizationData, setVisualizationData] = useState(null);
    const [initError, setInitError] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Initialize data on component mount
        initializeData()
            .then((res) => {
                setDataLoaded(true);
                setMessages([{
                    type: 'bot',
                    text: 'Helloo how i can help you today.',
                    timestamp: new Date()
                }]);
            })
            .catch(err => {
                console.error(err);
                setInitError('Failed to load data. Ensure backend is running.');
                setMessages([{
                    type: 'error',
                    text: 'Failed to load data. Please ensure the backend server is running and refresh the page.',
                    timestamp: new Date()
                }]);
            });
    }, []);

    useEffect(() => {
        // Scroll to bottom when new messages arrive
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (userMessage) => {
        if (!userMessage.trim() || isLoading) return;

        // Add user message
        const newUserMessage = {
            type: 'user',
            text: userMessage,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);

        try {
            const response = await sendMessage(userMessage);

            // Add bot response
            const botMessage = {
                type: 'bot',
                text: response.answer,
                data: response.data,
                visualization: response.visualization,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);

            // Update visualization if provided, otherwise keep previous or clear?
            // PRD implies it shows below messages. Let's update it.
            if (response.visualization) {
                setVisualizationData(response.visualization);
            }
        } catch (error) {
            const errorMessage = {
                type: 'bot',
                text: 'Sorry, I encountered an error processing your question.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickQuestion = (question) => {
        handleSendMessage(question);
    };

    return (
        <div className="flex flex-col h-screen bg-black flex-1">
            {/* Header */}
            {/* Header */}
            <div className="bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center space-x-3">
                    <img src="/logo.png" alt="PropertyLoop" className="h-8 object-contain" />
                    {/* <h1 className="text-xl font-bold text-white hidden">Holdings & Trades Assistant</h1> */}

                </div>
            </div>

            {/* Quick Questions */}
            <QuickQuestions onQuestionClick={handleQuickQuestion} />

            <div className="flex flex-1 overflow-hidden relative">
                {/* Background Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0">
                    <img src="/logo.png" alt="Background Logo" className="w-1/2 object-contain grayscale" />
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 z-10 relative">
                    <MessageList messages={messages} />

                    {isLoading && (
                        <div className="flex items-center space-x-2 text-gray-500 pl-4">
                            <div className="animate-bounce h-2 w-2 bg-blue-500 rounded-full"></div>
                            <div className="animate-bounce h-2 w-2 bg-blue-500 rounded-full h-delay-200"></div>
                            <div className="animate-bounce h-2 w-2 bg-blue-500 rounded-full h-delay-400"></div>
                            <span className="text-sm ml-2">Analyzing data...</span>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Desktop Visualization Panel (Right Side) - Optional enhancement over PRD */}
                {/* For now, keeping it simple as per PRD: visualization usually shown below, but let's make it a bottom panel or conditional */}

            </div>

            {/* Visualization Area (if available) */}
            {visualizationData && (
                <div className="bg-white border-t p-4 max-h-64 overflow-y-auto shadow-inner">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-gray-500">VISUALIZATION</span>
                            <button
                                onClick={() => setVisualizationData(null)}
                                className="text-xs text-gray-400 hover:text-gray-600"
                            >
                                Close
                            </button>
                        </div>
                        <DataVisualization data={visualizationData} />
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="max-w-4xl w-full mx-auto">
                <MessageInput onSendMessage={handleSendMessage} disabled={!dataLoaded || isLoading} />
            </div>
        </div>
    );
};

export default ChatInterface;
