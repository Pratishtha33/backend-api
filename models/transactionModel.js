class Transaction {
    constructor(transactionId, customerId, amount, paymentMethods, status) {
      this.transactionId = transactionId;
      this.customerId = customerId;
      this.amount = amount;
      this.paymentMethods = paymentMethods;
      this.status = status;
    }
  }
  
  module.exports = Transaction