const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const { registerClient, login, forgotPassword, resetPassword } = require("../controllers/authController");
const validate = require("../middleware/validate");
const { forgotPasswordSchema, resetPasswordSchema } = require("../validators/authValidator");

const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: { message: "Too many forgot password requests, please try again later after 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post("/register", registerClient);
router.post("/login", login);
router.post("/forgot-password", forgotPasswordLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

module.exports = router;