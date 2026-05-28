const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const {
    createJobSchema,
    updateJobSchema,
    updateStatusSchema,
    noteSchema
} = require("../validators/jobValidator");
const {protect, authorizeRoles} = require("../middleware/authMiddleware");
const {
    createJob,
    getClientJobs,
    getAssociateJobs,
    getSingleJob,
    updateJobStatus,
    addNote,
    uploadResumeRoute,
    updateJob,
    deleteJob
} = require("../controllers/jobController");
const checkSubscription = require("../middleware/subscriptionMiddleware");
const { uploadResumeMiddleware } = require("../middleware/uploadMiddleware");

router.post(
    "/",
    protect,
    authorizeRoles("associate"),
    checkSubscription,
    validate(createJobSchema),
    createJob
);

router.post(
    "/upload-resume",
    protect,
    authorizeRoles("associate"),
    uploadResumeMiddleware,
    uploadResumeRoute
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

router.patch(
    "/:id",
    protect,
    authorizeRoles("associate"),
    validate(updateJobSchema),
    updateJob
);

router.delete(
    "/:id",
    protect,
    authorizeRoles("associate"),
    deleteJob
);

module.exports = router;