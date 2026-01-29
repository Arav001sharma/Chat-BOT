// Basic validation utilities
const validateHoldings = (holdings) => {
    if (!Array.isArray(holdings)) return false;
    return holdings.every(h => h.ShortName && h.SecurityTypeName);
};

const validateTrades = (trades) => {
    if (!Array.isArray(trades)) return false;
    return trades.every(t => t.TradeTypeName && t.PortfolioName);
};

module.exports = {
    validateHoldings,
    validateTrades
};
