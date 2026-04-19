const mysql = require("mysql2/promise");

const connectionConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

if (process.env.DB_SOCKET) {
  connectionConfig.socketPath = process.env.DB_SOCKET;
} else {
  connectionConfig.host = process.env.DB_HOST;
  connectionConfig.port = Number(process.env.DB_PORT || 3306);
}

const pool = mysql.createPool(connectionConfig);

pool.testDbConnection = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
    await connection.query("SELECT 1");
  } finally {
    connection.release();
  }
};

module.exports = pool;
