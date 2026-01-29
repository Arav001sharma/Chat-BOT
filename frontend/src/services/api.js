import axios from 'axios';

const API_BASE_URL = '/api'; // Using proxy in vite.config.js

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const initializeData = async () => {
    try {
        const response = await api.post('/initialize');
        return response.data;
    } catch (error) {
        console.error('Error initializing data:', error);
        throw error;
    }
};

export const sendMessage = async (message) => {
    try {
        const response = await api.post('/query', { message });
        return response.data;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

export const getAvailableFunds = async () => {
    try {
        const response = await api.get('/funds');
        return response.data;
    } catch (error) {
        console.error('Error fetching funds:', error);
        throw error;
    }
};

export default api;
