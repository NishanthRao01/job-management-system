const express = require("express");
const router = express.Router();

const { createSubscription } = require("../controllers/subscriptionController");
const { protect } = require("../middleware/authMiddleware");

router.post("/",protect, createSubscription);
module.exports = router;