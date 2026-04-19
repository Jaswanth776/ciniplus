const pool = require("../config/db");

const getFoodItems = async (req, res, next) => {
  try {
    const [items] = await pool.execute(
      "SELECT id, name, price, is_available FROM Food_Items ORDER BY name ASC"
    );
    return res.status(200).json({ items });
  } catch (error) {
    return next(error);
  }
};

const createFoodItem = async (req, res, next) => {
  try {
    const { name, price, isAvailable } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }
    const [result] = await pool.execute(
      "INSERT INTO Food_Items (name, price, is_available) VALUES (?, ?, ?)",
      [name, price, typeof isAvailable === "boolean" ? isAvailable : true]
    );
    return res.status(201).json({ message: "Food item added", foodItemId: result.insertId });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getFoodItems,
  createFoodItem
};
