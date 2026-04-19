const express = require("express");
const { getShowsByMovie, createShow, getShowSeats } = require("../controllers/showController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/seats/:showId", getShowSeats);
router.get("/:movieId", getShowsByMovie);
router.post("/", authenticate, authorizeRoles("admin"), createShow);

module.exports = router;
