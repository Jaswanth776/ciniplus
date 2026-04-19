const pool = require("../config/db");

const findUserByEmail = async (email) => {
  const [rows] = await pool.execute(
    "SELECT id, name, email, password_hash, role FROM Users WHERE email = ?",
    [email]
  );
  return rows[0];
};

const createUser = async ({ name, email, passwordHash, role = "user" }) => {
  const [result] = await pool.execute(
    "INSERT INTO Users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [name, email, passwordHash, role]
  );
  return result.insertId;
};

module.exports = {
  findUserByEmail,
  createUser
};
