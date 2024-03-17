const express = require('express');
const bodyParser = require('body-parser');
const transactionRoutes = require('./routes/transactionRoutes');
const dbConfig = require('./config/dbConfig');


// Middleware
app.use(bodyParser.json());

// Routes
app.use('/', transactionRoutes);
app.listen(PORT, () => {
  console.log('Server is running on port ${PORT}');
});


const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Initiating transactions
app.post('/transactions', async (req, res) => {
  const { customer_id, amount, payment_methods } = req.body;

  try {
    // Insert transaction into database
    const newTransaction = await Transaction.create({ customer_id, amount });

    // Optionally, insert payment methods into PaymentMethods table
    if (payment_methods && payment_methods.length > 0) {
      await Promise.all(payment_methods.map(async (payment_method) => {
        await PaymentMethod.create({
          transaction_id: newTransaction.transaction_id,
          payment_method: payment_method.payment_method,
          amount: payment_method.amount
        });
      }));
    }

    res.status(201).json({ message: 'Transaction initiated successfully', transaction: newTransaction });
  } catch (error) {
    console.error('Error initiating transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Updating transaction statuses
app.put('/transactions/:transactionId/status', async (req, res) => {
  const { transactionId } = req.params;
  const { status } = req.body;

  try {
    // Update transaction status in the database
    await Transaction.update({ status }, { where: { transaction_id: transactionId } });

    res.status(200).json({ message: 'Transaction status updated successfully' });
  } catch (error) {
    console.error('Error updating transaction status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetching transaction details
app.get('/transactions/:transactionId', async (req, res) => {
  const { transactionId } = req.params;

  try {
    // Fetch transaction details from the database
    const transaction = await Transaction.findByPk(transactionId);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json({ transaction });
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Listing transactions for specific customers
app.get('/customers/:customerId/transactions', async (req, res) => {
  const { customerId } = req.params;

  try {
    // Fetch transactions for the customer from the database
    const transactions = await Transaction.findAll({ where: { customer_id: customerId } });

    res.status(200).json({ transactions });
  } catch (error) {
    console.error('Error fetching customer transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Calculating total payments per customer
app.get('/customers/:customerId/total-payments', async (req, res) => {
  const { customerId } = req.params;

  try {
    // Calculate total payments for the customer from the database
    const totalPayments = await Transaction.sum('amount', { where: { customer_id: customerId } });

    res.status(200).json({ totalPayments });
  } catch (error) {
    console.error('Error calculating total payments for customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;