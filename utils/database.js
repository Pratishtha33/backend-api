const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('database_name', 'username', 'password', {
  host: 'localhost', // Change this to your database host if it's not running locally
  dialect: 'postgres', // Specify the dialect as PostgreSQL
});


async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = {
  sequelize,
  testDatabaseConnection,
};
