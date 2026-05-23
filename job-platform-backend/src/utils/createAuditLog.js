const AuditLog =
    require("../models/AuditLog");

const createAuditLog =
    async ({
        action,
        performedBy,
        targetUser,
        details = {},
    }) => {

        await AuditLog.create({
            action,
            performedBy,
            targetUser,
            details,
        });

    };

module.exports =
    createAuditLog;