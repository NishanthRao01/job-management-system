const express = require("express");
const router = express.Router();

const {protect, authorizeRoles} = require("../middleware/authMiddleware");
const {createJob, getClientJobs, getAssociateJobs, getSingleJob, updateJobStatus, addNote} = require("../controllers/jobController");

router.post("/",protect, authorizeRoles("associate"),createJob);
router.get("/client",protect, authorizeRoles("client"),getClientJobs);
router.get("/associate",protect, authorizeRoles("associate"),getAssociateJobs);
router.get("/:id",protect, getSingleJob);
router.patch("/:id/status",protect, authorizeRoles("client"),updateJobStatus);
router.patch("/:id/notes",protect, addNote);

module.exports = router;