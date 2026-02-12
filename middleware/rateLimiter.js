const rateLimit = require('express-rate-limit');


const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests from this IP. Please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});


const transactionLimiter = rateLimit({
    windowMs: 1000,
    max: 5,
    message: {
        success: false,
        message: "Transaction limit reached (5 req/sec). Please slow down.",
    },
    standardHeaders: true,
    legacyHeaders: false,
}); 



module.exports = { globalLimiter, transactionLimiter}; 