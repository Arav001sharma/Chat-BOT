import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const DataVisualization = ({ data }) => {
    if (!data || !data.type) return null;

    const renderChart = () => {
        switch (data.type) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey={data.xKey} />
                            <YAxis />
                            <RechartsTooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend />
                            <Bar dataKey={data.yKey} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">{data.title}</h3>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
                {renderChart()}
            </div>
        </div>
    );
};

export default DataVisualization;
