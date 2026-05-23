const express = require("express");

const router = express.Router();

const {
    getAllUsers,
    toggleAssociateAvailability,
    getAssociates,
    getClients,
    reassignAssociate,
    getAllSubscriptions,
    getAllPayments,
    getAuditLogs,
} = require("../controllers/adminController");

const {
    protect,
    authorizeRoles,
} = require("../middleware/authMiddleware");

router.use(
    protect,
    authorizeRoles("admin")
);

router.get("/users", getAllUsers);

router.patch(
    "/associates/:userId/toggle-availability",
    toggleAssociateAvailability
);

router.get(
    "/associates",
    getAssociates
);

router.get(
    "/clients",
    getClients
);

router.patch(
    "/clients/:clientId/reassign",
    reassignAssociate
);

router.get(
    "/subscriptions",
    getAllSubscriptions
);

router.get(
    "/payments",
    getAllPayments
);

router.get(
    "/audit-logs",
    getAuditLogs
);

module.exports = router;