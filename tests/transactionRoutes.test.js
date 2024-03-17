const request = require('supertest');
const app = require('../app');

describe('Transaction Routes', () => {
    const request = require('supertest');
    const app = require('../server'); // Assuming your Express app is exported from server.js
    const { Transaction, PaymentMethod } = require('../models'); // Import your Sequelize models
  
    // Test for initiating transactions endpoint
    it('should initiate a new transaction', async () => {
      const response = await request(app)
        .post('/transactions')
        .send({
          customer_id: 1,
          amount: 100.00,
          payment_methods: [
            { payment_method: 'Credit Card', amount: 100.00 }
          ]
        });
  
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('transaction');
  
      // Cleanup: Remove the created transaction
      const { transaction } = response.body;
      await Transaction.destroy({ where: { transaction_id: transaction.transaction_id } });
    });
  
    // Test for updating transaction status endpoint
    it('should update transaction status', async () => {
      // First, initiate a new transaction to get a transaction ID for testing
      const newTransaction = await Transaction.create({
        customer_id: 1,
        amount: 100.00,
        status: 'Pending'
      });
  
      const response = await request(app)
        .put(`/transactions/${newTransaction.transaction_id}/status`)
        .send({ status: 'Completed' });
  
      expect(response.statusCode).toBe(200);
  
      // Cleanup: Remove the created transaction
      await Transaction.destroy({ where: { transaction_id: newTransaction.transaction_id } });
    });
  
    // Test for fetching transaction details endpoint
    it('should fetch transaction details', async () => {
      // First, initiate a new transaction to get a transaction ID for testing
      const newTransaction = await Transaction.create({
        customer_id: 1,
        amount: 100.00
      });
  
      const response = await request(app)
        .get(`/transactions/${newTransaction.transaction_id}`);
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('transaction');
  
      // Cleanup: Remove the created transaction
      await Transaction.destroy({ where: { transaction_id: newTransaction.transaction_id } });
    });
  
    // Test for listing transactions for specific customers endpoint
    it('should list transactions for a specific customer', async () => {
      // First, initiate some transactions for the customer
      await Transaction.bulkCreate([
        { customer_id: 1, amount: 50.00 },
        { customer_id: 1, amount: 75.00 },
        { customer_id: 2, amount: 100.00 } // Another customer's transaction for differentiation
      ]);
  
      const response = await request(app)
        .get('/customers/1/transactions');
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('transactions');
      expect(response.body.transactions).toHaveLength(2); // Assuming there are 2 transactions for customer 1
  
      // Cleanup: Remove the created transactions
      await Transaction.destroy({ where: { customer_id: 1 } });
    });
  
    // Test for calculating total payments per customer endpoint
    it('should calculate total payments per customer', async () => {
      // First, initiate some transactions for the customer
      await Transaction.bulkCreate([
        { customer_id: 1, amount: 50.00 },
        { customer_id: 1, amount: 75.00 },
        { customer_id: 2, amount: 100.00 } // Another customer's transaction for differentiation
      ]);
  
      const response = await request(app)
        .get('/customers/1/total-payments');
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('totalPayments');
      expect(response.body.totalPayments).toBe(125.00); // Assuming the total payment for customer 1 is 125.00
  
      // Cleanup: Remove the created transactions
      await Transaction.destroy({ where: { customer_id: 1 } });
    });
  });
  