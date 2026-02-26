const express = require('express');
const router = express.Router();
const dataLoader = require('../services/dataLoader');
const queryProcessor = require('../services/queryProcessor');

let dataStore = {
    holdings: [],
    trades: [],
    initialized: false
};

const ensureInitialized = async () => {
    if (!dataStore.initialized) {
        dataStore.holdings = await dataLoader.loadHoldings();
        dataStore.trades = await dataLoader.loadTrades();
        dataStore.initialized = true;
    }
};

// Initialize data
router.post('/initialize', async (req, res) => {
    try {
        await ensureInitialized();

        res.json({
            success: true,
            message: 'Data loaded successfully',
            stats: {
                holdingsCount: dataStore.holdings.length,
                tradesCount: dataStore.trades.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Process query
router.post('/query', async (req, res) => {
    try {
        const { message } = req.body;

        await ensureInitialized();

        if (!message || !message.trim()) {
            return res.status(400).json({
                error: 'Message is required'
            });
        }

        const response = await queryProcessor.processQuery(
            message,
            dataStore.holdings,
            dataStore.trades
        );

        res.json(response);
    } catch (error) {
        res.status(500).json({
            error: 'Error processing query',
            message: error.message
        });
    }
});

// Get list of all funds
router.get('/funds', async (req, res) => {
    try {
        await ensureInitialized();

        const holdingsFunds = [...new Set(dataStore.holdings.map(h => h.ShortName))];
        const tradesFunds = [...new Set(dataStore.trades.map(t => t.PortfolioName))];

        res.json({
            holdingsFunds,
            tradesFunds
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get statistics
router.get('/stats', async (req, res) => {
    try {
        await ensureInitialized();

        const uniqueHoldingsFunds = new Set(dataStore.holdings.map(h => h.ShortName)).size;
        const uniqueTradesFunds = new Set(dataStore.trades.map(t => t.PortfolioName)).size;
        const securityTypes = new Set(dataStore.holdings.map(h => h.SecurityTypeName)).size;

        res.json({
            totalHoldings: dataStore.holdings.length,
            totalTrades: dataStore.trades.length,
            uniqueHoldingsFunds,
            uniqueTradesFunds,
            securityTypes
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
