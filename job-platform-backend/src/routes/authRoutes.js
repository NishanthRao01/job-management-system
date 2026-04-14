const express =  require("express");
const router = express.Router();

//imports authController file and performs destructuring and only gives registerClient
const { registerClient, login } = require("../controllers/authController");

//when clients sends a post req, run the registerClient function
router.post("/register", registerClient);
router.post("/login",login);
module.exports = router;