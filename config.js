module.exports = {
    mongoURI: process.env.MONGODB_URI,
    moniepointAPIKey: process.env.MONIEPOINT_API_KEY,
    moniepointSecret: process.env.MONIEPOINT_SECRET,
    usdToNGN: process.env.USD_TO_NGN || 1500,
    davCoinValueUSD: 10000
};
