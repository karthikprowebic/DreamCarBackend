// server.js
require("dotenv").config();  // load .env first
const app = require("./src/app");
const { sequelize } = require("./src/models");

const PORT = process.env.PORT || 3000;

sequelize.sync({})
  .then(() => {
    console.log("Database synced successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });
