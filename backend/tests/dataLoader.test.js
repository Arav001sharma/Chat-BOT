const dataLoader = require('../services/dataLoader');
const path = require('path');

describe('DataLoader', () => {
    test('should load holdings data correctly', async () => {
        const holdings = await dataLoader.loadHoldings();
        expect(Array.isArray(holdings)).toBe(true);
        expect(holdings.length).toBeGreaterThan(0);

        const first = holdings[0];
        expect(first).toHaveProperty('ShortName');
        expect(first).toHaveProperty('PL_YTD');
        expect(typeof first.PL_YTD).toBe('number');
    });

    test('should load trades data correctly', async () => {
        const trades = await dataLoader.loadTrades();
        expect(Array.isArray(trades)).toBe(true);
        expect(trades.length).toBeGreaterThan(0);

        const first = trades[0];
        expect(first).toHaveProperty('TradeTypeName');
        expect(first).toHaveProperty('Quantity');
        expect(typeof first.Quantity).toBe('number');
    });
});
