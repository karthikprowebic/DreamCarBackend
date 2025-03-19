const { Sequelize } = require('sequelize');

const dbName = process.env.DB_NAME 
const dbUser = process.env.DB_USER 
const dbPassword = ""
const dbHost = process.env.DB_HOST 

// Initialize Sequelize instance
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'mysql',
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = { sequelize };
