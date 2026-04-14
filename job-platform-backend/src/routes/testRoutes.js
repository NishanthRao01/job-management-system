const express = require("express");
const router = express.Router();

const {protect, authorizeRoles} = require("../middleware/authMiddleware");

router.get("/protected", protect, (req,res) => {
    res.json({
        message: "Protected route accessed",
        user: req.user,
    });
});

router.get("/associate-only",protect,authorizeRoles("associate"), (req,res) => {
    res.json({message: "Welcome Associate"});
});

module.exports = router;