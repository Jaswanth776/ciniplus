const pool = require("../config/db");

const getAllBookings = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT b.id, b.booking_ref, b.total_amount, b.booking_status, b.created_at,
      u.name AS user_name, m.title AS movie_title
      FROM Bookings b
      JOIN Users u ON b.user_id = u.id
      JOIN Shows s ON b.show_id = s.id
      JOIN Movies m ON s.movie_id = m.id
      ORDER BY b.created_at DESC`
    );
    return res.status(200).json({ bookings: rows });
  } catch (error) {
    return next(error);
  }
};

const getRevenue = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT
      COUNT(*) AS total_bookings,
      COALESCE(SUM(total_amount), 0) AS total_revenue
      FROM Bookings
      WHERE booking_status = 'confirmed'`
    );
    return res.status(200).json({ revenue: rows[0] });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllBookings,
  getRevenue
};
