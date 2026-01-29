const express = require('express');
const router = express.Router();
const dataLoader = require('../services/dataLoader');
const queryProcessor = require('../services/queryProcessor');

let dataStore = {
    holdings: [],
    trades: [],
    initialized: false
};

// Initialize data
router.post('/initialize', async (req, res) => {
    try {
        if (!dataStore.initialized) {
            const holdings = await dataLoader.loadHoldings();
            const trades = await dataLoader.loadTrades();

            dataStore.holdings = holdings;
            dataStore.trades = trades;
            dataStore.initialized = true;
        }

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

        if (!dataStore.initialized) {
            return res.status(400).json({
                error: 'Data not initialized'
            });
        }

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
router.get('/funds', (req, res) => {
    try {
        if (!dataStore.initialized) {
            return res.status(400).json({ error: 'Data not initialized' });
        }

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
router.get('/stats', (req, res) => {
    try {
        if (!dataStore.initialized) {
            return res.status(400).json({ error: 'Data not initialized' });
        }

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
