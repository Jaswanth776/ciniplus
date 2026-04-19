const pool = require("../config/db");

const getShowsByMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const [shows] = await pool.execute(
      `SELECT s.id, s.movie_id, s.screen_id, s.show_date, s.start_time, s.base_price,
      t.name AS theatre_name, sc.screen_name
      FROM Shows s
      JOIN Screens sc ON s.screen_id = sc.id
      JOIN Theatres t ON sc.theatre_id = t.id
      WHERE s.movie_id = ? AND s.show_date >= CURDATE()
      ORDER BY s.show_date, s.start_time`,
      [movieId]
    );
    return res.status(200).json({ shows });
  } catch (error) {
    return next(error);
  }
};

const createShow = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { movieId, screenId, showDate, startTime, basePrice } = req.body;
    if (!movieId || !screenId || !showDate || !startTime || !basePrice) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO Shows (movie_id, screen_id, show_date, start_time, base_price)
      VALUES (?, ?, ?, ?, ?)`,
      [movieId, screenId, showDate, startTime, basePrice]
    );
    const showId = result.insertId;

    await connection.execute(
      `INSERT INTO Show_Seats (show_id, seat_id, status)
      SELECT ?, id, 'available' FROM Seats WHERE screen_id = ?`,
      [showId, screenId]
    );

    await connection.commit();
    return res.status(201).json({ message: "Show created successfully", showId });
  } catch (error) {
    await connection.rollback();
    return next(error);
  } finally {
    connection.release();
  }
};

const getShowSeats = async (req, res, next) => {
  try {
    const { showId } = req.params;
    const [seats] = await pool.execute(
      `SELECT ss.id AS show_seat_id, s.id AS seat_id, s.row_label, s.seat_number, ss.status
      FROM Show_Seats ss
      JOIN Seats s ON ss.seat_id = s.id
      WHERE ss.show_id = ?
      ORDER BY s.row_label, s.seat_number`,
      [showId]
    );
    return res.status(200).json({ seats });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getShowsByMovie,
  createShow,
  getShowSeats
};
