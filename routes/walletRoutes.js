const express = require('express'); 
const router = express.Router(); 

const walletController = require('../controllers/walletController'); 
const {globalLimiter, transactionLimiter} = require('../middleware/rateLimiter');

// Apply global protection to ALL routes in this router
router.use(globalLimiter);

// Apply strict 5-per-second limit to money-moving endpoints
router.post('/top-up', transactionLimiter, walletController.topUp);
router.post('/spend', transactionLimiter, walletController.spend);
router.post('/bonus', transactionLimiter, walletController.issueBonus);


module.exports = router; 