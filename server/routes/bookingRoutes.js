const express = require("express");
const { createBooking, getUserBookings } = require("../controllers/bookingController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, createBooking);
router.get("/user", authenticate, getUserBookings);

module.exports = router;
