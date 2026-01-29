const { formatCurrency, formatNumber } = require('../utils/formatters');

class ResponseGenerator {
    formatCountResponse(count, type, fund) {
        return {
            answer: `${fund} has ${formatNumber(count)} ${type}.`,
            data: {
                count: count,
                type: type,
                fund: fund
            }
        };
    }

    formatMultipleCounts(results, type) {
        const total = results.reduce((sum, r) => sum + r.count, 0);
        const details = results.map(r => `${r.fund}: ${formatNumber(r.count)}`).join('\n');

        return {
            answer: `Here are the ${type} counts:\n${details}\n\nTotal: ${formatNumber(total)} ${type}`,
            data: {
                table: results.map(r => ({
                    Fund: r.fund,
                    Count: formatNumber(r.count)
                }))
            }
        };
    }

    formatSinglePerformance(result) {
        const performance = result.ytdPL >= 0 ? 'profit' : 'loss';

        return {
            answer: `${result.fund} has a year-to-date ${performance} of ${formatCurrency(Math.abs(result.ytdPL))}.`,
            data: {
                fund: result.fund,
                ytdPL: result.ytdPL,
                formatted: formatCurrency(result.ytdPL)
            }
        };
    }

    formatMultiplePerformance(results) {
        const details = results.map(r =>
            `${r.fund}: ${formatCurrency(r.ytdPL)}`
        ).join('\n');

        return {
            answer: `Here are the year-to-date P&L figures:\n${details}`,
            data: {
                table: results.map(r => ({
                    Fund: r.fund,
                    'YTD P&L': formatCurrency(r.ytdPL)
                }))
            }
        };
    }

    formatPerformanceComparison(results) {
        const sorted = [...results].sort((a, b) => b.ytdPL - a.ytdPL);
        const best = sorted[0];
        const worst = sorted[sorted.length - 1];

        const answer = `Based on year-to-date P&L:\n\n` +
            `Best performer: ${best.fund} with ${formatCurrency(best.ytdPL)}\n` +
            `Worst performer: ${worst.fund} with ${formatCurrency(worst.ytdPL)}\n\n` +
            `Difference: ${formatCurrency(best.ytdPL - worst.ytdPL)}`;

        return {
            answer: answer,
            data: {
                table: sorted.map(r => ({
                    Fund: r.fund,
                    'YTD P&L': formatCurrency(r.ytdPL)
                }))
            },
            visualization: {
                type: 'bar',
                title: 'Fund Performance Comparison (YTD P&L)',
                data: sorted.map(r => ({
                    fund: r.fund,
                    pl: r.ytdPL
                })),
                xKey: 'fund',
                yKey: 'pl'
            }
        };
    }

    formatBestPerformer(results) {
        const best = results[0];

        return {
            answer: `The best performing fund is ${best.fund} with a year-to-date P&L of ${formatCurrency(best.ytdPL)}.`,
            data: {
                fund: best.fund,
                ytdPL: best.ytdPL
            }
        };
    }

    formatAllFundsPerformance(results) {
        const details = results.map((r, index) =>
            `${index + 1}. ${r.fund}: ${formatCurrency(r.ytdPL)}`
        ).join('\n');

        return {
            answer: `Here are all funds ranked by year-to-date performance:\n\n${details}`,
            data: {
                table: results.map((r, index) => ({
                    Rank: index + 1,
                    Fund: r.fund,
                    'YTD P&L': formatCurrency(r.ytdPL)
                }))
            },
            visualization: {
                type: 'bar',
                title: 'All Funds Performance (YTD P&L)',
                data: results.map(r => ({
                    fund: r.fund,
                    pl: r.ytdPL
                })),
                xKey: 'fund',
                yKey: 'pl'
            }
        };
    }

    formatMarketValue(result) {
        return {
            answer: `${result.fund} has a total market value of ${formatCurrency(result.marketValue)}.`,
            data: {
                fund: result.fund,
                marketValue: result.marketValue
            }
        };
    }

    formatMultipleMarketValues(results) {
        const details = results.map(r =>
            `${r.fund}: ${formatCurrency(r.marketValue)}`
        ).join('\n');

        const total = results.reduce((sum, r) => sum + r.marketValue, 0);

        return {
            answer: `Here are the market values:\n${details}\n\nTotal: ${formatCurrency(total)}`,
            data: {
                table: results.map(r => ({
                    Fund: r.fund,
                    'Market Value': formatCurrency(r.marketValue)
                }))
            }
        };
    }

    formatFundsList(holdingsFunds, tradesFunds) {
        const allFunds = [...new Set([...holdingsFunds, ...tradesFunds])].sort();

        const answer = `I found ${allFunds.length} unique funds across both datasets:\n\n` +
            allFunds.map((f, i) => `${i + 1}. ${f}`).join('\n');

        return {
            answer: answer,
            data: {
                fundsList: allFunds,
                holdingsFunds: holdingsFunds,
                tradesFunds: tradesFunds
            }
        };
    }

    formatComparison(results) {
        const details = results.map(r =>
            `${r.fund}:\n` +
            `  - Holdings: ${formatNumber(r.holdingsCount)}\n` +
            `  - Market Value: ${formatCurrency(r.marketValue)}\n` +
            `  - YTD P&L: ${formatCurrency(r.ytdPL)}`
        ).join('\n\n');

        return {
            answer: `Fund Comparison:\n\n${details}`,
            data: {
                table: results.map(r => ({
                    Fund: r.fund,
                    Holdings: formatNumber(r.holdingsCount),
                    'Market Value': formatCurrency(r.marketValue),
                    'YTD P&L': formatCurrency(r.ytdPL)
                }))
            }
        };
    }
}

module.exports = new ResponseGenerator();
