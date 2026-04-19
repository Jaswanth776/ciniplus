const express = require("express");
const { getAllBookings, getRevenue } = require("../controllers/adminController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/bookings", authenticate, authorizeRoles("admin"), getAllBookings);
router.get("/revenue", authenticate, authorizeRoles("admin"), getRevenue);

module.exports = router;
