const pool = require("../config/db");
const { isAllowedLanguage } = require("../utils/validators");

const getMovies = async (req, res, next) => {
  try {
    const [movies] = await pool.execute(
      "SELECT id, title, language, genre, duration_minutes, description, poster_url, release_date FROM Movies ORDER BY release_date DESC"
    );
    return res.status(200).json({ movies });
  } catch (error) {
    return next(error);
  }
};

const getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      "SELECT id, title, language, genre, duration_minutes, description, poster_url, release_date FROM Movies WHERE id = ?",
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: "Movie not found" });
    }
    return res.status(200).json({ movie: rows[0] });
  } catch (error) {
    return next(error);
  }
};

const addMovie = async (req, res, next) => {
  try {
    const { title, language, genre, durationMinutes, description, posterUrl, releaseDate } = req.body;
    if (!title || !language || !genre || !durationMinutes || !releaseDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!isAllowedLanguage(language)) {
      return res
        .status(400)
        .json({ message: "Only South Indian languages are allowed" });
    }

    const [result] = await pool.execute(
      `INSERT INTO Movies
      (title, language, genre, duration_minutes, description, poster_url, release_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, language, genre, durationMinutes, description || "", posterUrl || "", releaseDate]
    );
    return res.status(201).json({ message: "Movie added successfully", movieId: result.insertId });
  } catch (error) {
    return next(error);
  }
};

const updateMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, language, genre, durationMinutes, description, posterUrl, releaseDate } = req.body;
    if (language && !isAllowedLanguage(language)) {
      return res
        .status(400)
        .json({ message: "Only South Indian languages are allowed" });
    }

    await pool.execute(
      `UPDATE Movies SET
      title = COALESCE(?, title),
      language = COALESCE(?, language),
      genre = COALESCE(?, genre),
      duration_minutes = COALESCE(?, duration_minutes),
      description = COALESCE(?, description),
      poster_url = COALESCE(?, poster_url),
      release_date = COALESCE(?, release_date)
      WHERE id = ?`,
      [title, language, genre, durationMinutes, description, posterUrl, releaseDate, id]
    );
    return res.status(200).json({ message: "Movie updated successfully" });
  } catch (error) {
    return next(error);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.execute("DELETE FROM Movies WHERE id = ?", [id]);
    return res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie
};
