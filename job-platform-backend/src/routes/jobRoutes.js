const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const {
    createJobSchema,
    updateStatusSchema,
    noteSchema
} = require("../validators/jobValidator");
const {protect, authorizeRoles} = require("../middleware/authMiddleware");
const {createJob, getClientJobs, getAssociateJobs, getSingleJob, updateJobStatus, addNote} = require("../controllers/jobController");
const checkSubscription = require("../middleware/subscriptionMiddleware");

router.post(
    "/",
    protect,
    authorizeRoles("associate"),
    checkSubscription,
    validate(createJobSchema),
    createJob
);

router.get("/client",protect, authorizeRoles("client"),getClientJobs);
router.get("/associate",protect, authorizeRoles("associate"),getAssociateJobs);
router.get("/:id",protect, getSingleJob);

router.patch(
    "/:id/status",
    protect,
    authorizeRoles("client"),
    validate(updateStatusSchema),
    updateJobStatus
);

router.patch(
    "/:id/notes",
    protect,
    validate(noteSchema),
    addNote
);

module.exports = router;