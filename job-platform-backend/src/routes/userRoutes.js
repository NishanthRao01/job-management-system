const express = require("express");
const router = express.Router();
const { getAssignedClients } = require("../controllers/userController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/clients", protect, authorizeRoles("associate"), getAssignedClients);

module.exports = router;
