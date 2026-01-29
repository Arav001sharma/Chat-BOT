const dataEngine = require('./dataEngine');
const responseGenerator = require('./responseGenerator');

class QueryProcessor {
    constructor() {
        this.intentPatterns = {
            countHoldings: /how many holdings|total holdings|count.*holdings|number.*holdings/i,
            countTrades: /how many trades|total trades|count.*trades|number.*trades/i,
            performance: /performance|profit|loss|p&l|pl|ytd|better|best|worst/i,
            marketValue: /market value|mv|total value/i,
            listFunds: /list.*funds|all funds|show.*funds|which funds/i,
            specificSecurity: /show.*security|holdings.*for|trades.*for/i,
            comparison: /compare|versus|vs|between/i
        };
    }

    async processQuery(message, holdings, trades) {
        const lowercaseMessage = message.toLowerCase();

        // Extract fund names from message
        const fundNames = this.extractFundNames(message, holdings, trades);

        // Determine intent
        const intent = this.determineIntent(lowercaseMessage);

        // Process based on intent
        let result;
        try {
            switch (intent) {
                case 'countHoldings':
                    result = this.handleCountHoldings(fundNames, holdings, lowercaseMessage);
                    break;
                case 'countTrades':
                    result = this.handleCountTrades(fundNames, trades, lowercaseMessage);
                    break;
                case 'performance':
                    result = this.handlePerformance(fundNames, holdings, lowercaseMessage);
                    break;
                case 'marketValue':
                    result = this.handleMarketValue(fundNames, holdings);
                    break;
                case 'listFunds':
                    result = this.handleListFunds(holdings, trades);
                    break;
                case 'comparison':
                    result = this.handleComparison(fundNames, holdings, lowercaseMessage);
                    break;
                default:
                    result = { answer: "Sorry, cannot find the answer" };
            }
        } catch (error) {
            console.error('Error processing query:', error);
            result = { answer: "Sorry, cannot find the answer" };
        }

        return result;
    }

    determineIntent(message) {
        for (const [intent, pattern] of Object.entries(this.intentPatterns)) {
            if (pattern.test(message)) {
                return intent;
            }
        }
        return 'unknown';
    }

    extractFundNames(message, holdings, trades) {
        const fundNames = [];
        const uniqueHoldingsFunds = [...new Set(holdings.map(h => h.ShortName))];
        const uniqueTradesFunds = [...new Set(trades.map(t => t.PortfolioName))];
        const allFunds = [...new Set([...uniqueHoldingsFunds, ...uniqueTradesFunds])];

        const lowerMessage = message.toLowerCase();

        // Check for each fund name
        allFunds.forEach(fund => {
            if (lowerMessage.includes(fund.toLowerCase())) {
                fundNames.push(fund);
            }
        });

        // Handle common abbreviations
        if (lowerMessage.includes('mnc')) fundNames.push('MNC Inv');
        if (lowerMessage.includes('northpoint')) fundNames.push('NorthPoint');

        return [...new Set(fundNames)];
    }

    handleCountHoldings(fundNames, holdings, message) {
        if (fundNames.length === 0) {
            // Count all holdings
            return responseGenerator.formatCountResponse(
                holdings.length,
                'holdings',
                'all funds'
            );
        }

        // Count holdings for specific fund(s)
        const results = fundNames.map(fundName => {
            const fundHoldings = dataEngine.getHoldingsByFund(holdings, fundName);
            return {
                fund: fundName,
                count: fundHoldings.length
            };
        });

        if (results.length === 1) {
            return responseGenerator.formatCountResponse(
                results[0].count,
                'holdings',
                results[0].fund
            );
        } else {
            return responseGenerator.formatMultipleCounts(results, 'holdings');
        }
    }

    handleCountTrades(fundNames, trades, message) {
        if (fundNames.length === 0) {
            return responseGenerator.formatCountResponse(
                trades.length,
                'trades',
                'all funds'
            );
        }

        const results = fundNames.map(fundName => {
            const fundTrades = dataEngine.getTradesByFund(trades, fundName);
            return {
                fund: fundName,
                count: fundTrades.length
            };
        });

        if (results.length === 1) {
            return responseGenerator.formatCountResponse(
                results[0].count,
                'trades',
                results[0].fund
            );
        } else {
            return responseGenerator.formatMultipleCounts(results, 'trades');
        }
    }

    handlePerformance(fundNames, holdings, message) {
        if (fundNames.length === 0) {
            // Show all funds performance
            return this.handleAllFundsPerformance(holdings, message);
        }

        // Show specific fund(s) performance
        const results = fundNames.map(fundName => {
            const fundHoldings = dataEngine.getHoldingsByFund(holdings, fundName);
            const ytdPL = dataEngine.calculateTotalYTD(fundHoldings);
            return {
                fund: fundName,
                ytdPL: ytdPL
            };
        });

        if (message.includes('better') || message.includes('best') || message.includes('compare')) {
            return responseGenerator.formatPerformanceComparison(results);
        }

        if (results.length === 1) {
            return responseGenerator.formatSinglePerformance(results[0]);
        } else {
            return responseGenerator.formatMultiplePerformance(results);
        }
    }

    handleAllFundsPerformance(holdings, message) {
        const fundNames = [...new Set(holdings.map(h => h.ShortName))];
        const results = fundNames.map(fundName => {
            const fundHoldings = dataEngine.getHoldingsByFund(holdings, fundName);
            const ytdPL = dataEngine.calculateTotalYTD(fundHoldings);
            return {
                fund: fundName,
                ytdPL: ytdPL
            };
        }).sort((a, b) => b.ytdPL - a.ytdPL); // Sort by performance

        if (message.includes('better') || message.includes('best')) {
            return responseGenerator.formatBestPerformer(results);
        }

        return responseGenerator.formatAllFundsPerformance(results);
    }

    handleMarketValue(fundNames, holdings) {
        if (fundNames.length === 0) {
            return { answer: "Sorry, cannot find the answer" };
        }

        const results = fundNames.map(fundName => {
            const fundHoldings = dataEngine.getHoldingsByFund(holdings, fundName);
            const totalMV = dataEngine.calculateTotalMarketValue(fundHoldings);
            return {
                fund: fundName,
                marketValue: totalMV
            };
        });

        if (results.length === 1) {
            return responseGenerator.formatMarketValue(results[0]);
        } else {
            return responseGenerator.formatMultipleMarketValues(results);
        }
    }

    handleListFunds(holdings, trades) {
        const holdingsFunds = [...new Set(holdings.map(h => h.ShortName))].sort();
        const tradesFunds = [...new Set(trades.map(t => t.PortfolioName))].sort();

        return responseGenerator.formatFundsList(holdingsFunds, tradesFunds);
    }

    handleComparison(fundNames, holdings, message) {
        if (fundNames.length < 2) {
            return { answer: "Sorry, cannot find the answer" };
        }

        const results = fundNames.map(fundName => {
            const fundHoldings = dataEngine.getHoldingsByFund(holdings, fundName);
            const ytdPL = dataEngine.calculateTotalYTD(fundHoldings);
            const totalMV = dataEngine.calculateTotalMarketValue(fundHoldings);
            return {
                fund: fundName,
                ytdPL: ytdPL,
                marketValue: totalMV,
                holdingsCount: fundHoldings.length
            };
        });

        return responseGenerator.formatComparison(results);
    }
}

module.exports = new QueryProcessor();
