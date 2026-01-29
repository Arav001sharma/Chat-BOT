import React from 'react';

const QuickQuestions = ({ onQuestionClick }) => {
    const questions = [
        "How many holdings does Garfield have?",
        "Which fund performed better this year?",
        "Total trades for MNC Investment Fund",
        "Show me all funds and their YTD P&L",
        "What is the total market value of Heather's portfolio?",
        "Compare Garfield and Heather"
    ];

    return (
        <div className="bg-black border-b border-gray-800 p-4">
            <p className="text-sm text-gray-400 mb-2 font-medium">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
                {questions.map((question, index) => (
                    <button
                        key={index}
                        onClick={() => onQuestionClick(question)}
                        className="px-3 py-1.5 text-sm bg-neutral-900 text-gray-200 rounded-full hover:bg-neutral-800 hover:border-gray-600 transition-colors border border-gray-800"
                    >
                        {question}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickQuestions;
