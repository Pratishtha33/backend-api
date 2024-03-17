const request = require('supertest');
const app = require('../server');

describe('Transaction Routes', () => {
    const request = require('supertest');
    const app = require('../server'); // Assuming your Express app is exported from server.js
  
    // Test for initiating transactions endpoint
    it('should initiate a new transaction', async () => {
      const res = await request(app)
        .post('/transactions')
        .send({
          customer_id: 1,
          amount: 100.00,
          payment_methods: [
            { payment_method: 'Credit Card', amount: 100.00 }
          ]
        });
        
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('transaction');
    });
  
    // Test for updating transaction status endpoint
    it('should update transaction status', async () => {
      const transactionId = 1;
      const res = await request(app)
        .put(`/transactions/${transactionId}/status`)
        .send({ status: 'Completed' });
        
      expect(res.statusCode).toEqual(200);
    });
  
    // Test for fetching transaction details endpoint
    it('should fetch transaction details', async () => {
      const transactionId = 1;
      const res = await request(app)
        .get(`/transactions/${transactionId}`);
        
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('transaction');
    });
  
    // Test for listing transactions for specific customers endpoint
    it('should list transactions for a specific customer', async () => {
      const customerId = 1;
      const res = await request(app)
        .get(`/customers/${customerId}/transactions`);
        
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('transactions');
    });
  
    // Test for calculating total payments per customer endpoint
    it('should calculate total payments per customer', async () => {
      const customerId = 1;
      const res = await request(app)
        .get(`/customers/${customerId}/total-payments`);
        
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('totalPayments');
    });
  });
  
