const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

class DataLoader {
    constructor() {
        this.holdingsPath = path.join(__dirname, '../data/holdings.csv');
        this.tradesPath = path.join(__dirname, '../data/trades.csv');
    }

    loadHoldings() {
        return new Promise((resolve, reject) => {
            try {
                let currentPath = this.holdingsPath;
                if (!fs.existsSync(currentPath)) {
                    currentPath = path.join(__dirname, '../data/example_holdings.csv');
                    if (!fs.existsSync(currentPath)) {
                        reject(new Error(`Holdings file not found at ${this.holdingsPath} or ${currentPath}`));
                        return;
                    }
                }
                const fileContent = fs.readFileSync(currentPath, 'utf-8');
                const records = csv.parse(fileContent, {
                    columns: true,
                    skip_empty_lines: true,
                    trim: true
                });

                // Parse numeric fields
                const parsed = records.map(record => ({
                    ...record,
                    Qty: parseFloat(record.Qty) || 0,
                    Price: parseFloat(record.Price) || 0,
                    MV_Base: parseFloat(record.MV_Base) || 0,
                    PL_DTD: parseFloat(record.PL_DTD) || 0,
                    PL_QTD: parseFloat(record.PL_QTD) || 0,
                    PL_MTD: parseFloat(record.PL_MTD) || 0,
                    PL_YTD: parseFloat(record.PL_YTD) || 0
                }));

                console.log(`Loaded ${parsed.length} holdings records`);
                resolve(parsed);
            } catch (error) {
                reject(new Error(`Error loading holdings: ${error.message}`));
            }
        });
    }

    loadTrades() {
        return new Promise((resolve, reject) => {
            try {
                let currentPath = this.tradesPath;
                if (!fs.existsSync(currentPath)) {
                    currentPath = path.join(__dirname, '../data/example_trades.csv');
                    if (!fs.existsSync(currentPath)) {
                        reject(new Error(`Trades file not found at ${this.tradesPath} or ${currentPath}`));
                        return;
                    }
                }
                const fileContent = fs.readFileSync(currentPath, 'utf-8');
                const records = csv.parse(fileContent, {
                    columns: true,
                    skip_empty_lines: true,
                    trim: true
                });

                // Parse numeric fields
                const parsed = records.map(record => ({
                    ...record,
                    Quantity: parseFloat(record.Quantity) || 0,
                    Price: parseFloat(record.Price) || 0,
                    Principal: parseFloat(record.Principal) || 0,
                    AllocationQTY: parseFloat(record.AllocationQTY) || 0,
                    AllocationPrincipal: parseFloat(record.AllocationPrincipal) || 0,
                    AllocationCash: parseFloat(record.AllocationCash) || 0
                }));

                console.log(`Loaded ${parsed.length} trades records`);
                resolve(parsed);
            } catch (error) {
                reject(new Error(`Error loading trades: ${error.message}`));
            }
        });
    }
}

module.exports = new DataLoader();
