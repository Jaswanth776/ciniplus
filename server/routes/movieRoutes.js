const express = require("express");
const {
  getMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie
} = require("../controllers/movieController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getMovies);
router.get("/:id", getMovieById);
router.post("/", authenticate, authorizeRoles("admin"), addMovie);
router.put("/:id", authenticate, authorizeRoles("admin"), updateMovie);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteMovie);

module.exports = router;
