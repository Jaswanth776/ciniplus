const express = require("express");
const { getFoodItems, createFoodItem } = require("../controllers/foodController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getFoodItems);
router.post("/", authenticate, authorizeRoles("admin"), createFoodItem);

module.exports = router;
