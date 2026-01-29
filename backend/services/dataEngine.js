class DataEngine {
    getHoldingsByFund(holdings, fundName) {
        if (!fundName) return [];
        return holdings.filter(h =>
            h.ShortName.toLowerCase() === fundName.toLowerCase() ||
            (h.PortfolioName && h.PortfolioName.toLowerCase().includes(fundName.toLowerCase()))
        );
    }

    getTradesByFund(trades, fundName) {
        if (!fundName) return [];
        return trades.filter(t =>
            t.PortfolioName && t.PortfolioName.toLowerCase().includes(fundName.toLowerCase())
        );
    }

    calculateTotalYTD(holdings) {
        return holdings.reduce((sum, h) => sum + h.PL_YTD, 0);
    }

    calculateTotalMarketValue(holdings) {
        return holdings.reduce((sum, h) => sum + h.MV_Base, 0);
    }

    getHoldingsBySecurityType(holdings, securityType) {
        return holdings.filter(h =>
            h.SecurityTypeName && h.SecurityTypeName.toLowerCase() === securityType.toLowerCase()
        );
    }

    getTradesByType(trades, tradeType) {
        return trades.filter(t =>
            t.TradeTypeName && t.TradeTypeName.toLowerCase() === tradeType.toLowerCase()
        );
    }

    aggregateByFund(holdings) {
        const fundMap = new Map();

        holdings.forEach(h => {
            const fund = h.ShortName;
            if (!fundMap.has(fund)) {
                fundMap.set(fund, {
                    fund: fund,
                    totalHoldings: 0,
                    totalMV: 0,
                    totalYTD: 0
                });
            }

            const fundData = fundMap.get(fund);
            fundData.totalHoldings++;
            fundData.totalMV += h.MV_Base;
            fundData.totalYTD += h.PL_YTD;
        });

        return Array.from(fundMap.values());
    }

    searchSecurities(holdings, trades, searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();

        const matchingHoldings = holdings.filter(h =>
            (h.SecName && h.SecName.toLowerCase().includes(lowerSearch)) ||
            (h.SecurityTypeName && h.SecurityTypeName.toLowerCase().includes(lowerSearch))
        );

        const matchingTrades = trades.filter(t =>
            (t.Name && t.Name.toLowerCase().includes(lowerSearch)) ||
            (t.Ticker && t.Ticker.toLowerCase().includes(lowerSearch))
        );

        return { holdings: matchingHoldings, trades: matchingTrades };
    }
}

module.exports = new DataEngine();
