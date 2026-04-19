require("dotenv").config();
const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  let retries = 10;
  while (retries > 0) {
    try {
      await pool.testDbConnection();
      console.log("MySQL connection established successfully");
      
      app.listen(PORT, () => {
        console.log(`Cini Plus server running on port ${PORT}`);
      });
      return; // Exit retry loop
    } catch (error) {
      console.error(`Failed to connect to MySQL. Retries left: ${retries - 1}`);
      console.error(error.code || error.message);
      retries -= 1;
      if (retries === 0) {
        console.error("Exhausted all retries. Exiting.");
        process.exit(1);
      }
      // Wait for 3 seconds before retrying
      await new Promise(res => setTimeout(res, 3000));
    }
  }
};

startServer();
