
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Define routes for transaction endpoints
router.post('/transactions', transactionController.startTransaction);
router.get('/transactions/:transactionId', transactionController.getTransactionDetails);
router.put('/transactions/:transactionId', transactionController.updateTransactionStatus);
router.get('/transactions/customer/:customerId', transactionController.listTransactionsForCustomer);
router.get('/transactions/sales/:customerId', transactionController.calculateTotalSalesPerCustomer);

module.exports = router;

