const User = require("../models/User");

const asyncHandler =
    require("../utils/asyncHandler");

const Subscription =
    require("../models/Subscription");

const Payment =
    require("../models/Payment");

const AuditLog =
    require("../models/AuditLog");

const AppError =
    require("../utils/AppError");

const createAuditLog =
    require("../utils/createAuditLog");

exports.getAllUsers = asyncHandler(
    async (req, res) => {

        const users = await User.find()
            .select("-password")
            .populate(
                "assignedAssociate",
                "name email"
            );

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });

    }
);

exports.toggleAssociateAvailability =
    asyncHandler(async (req, res) => {

        const { userId } = req.params;

        const associate =
            await User.findById(userId);

        if (!associate) {
            throw new AppError(
                "User not found",
                404
            );
        }

        if (
            associate.role !== "associate"
        ) {
            throw new AppError(
                "Only associates can be updated",
                400
            );
        }

        associate.isAvailable =
            !associate.isAvailable;

        await associate.save();

        await createAuditLog({
            action:
                "ASSOCIATE_AVAILABILITY_CHANGED",
            performedBy: req.user.userId,
        
            targetUser: associate._id,
        
            details: {
                isAvailable:
                    associate.isAvailable,
            },
        });

        res.status(200).json({
            success: true,
            message:
                "Associate availability updated",
            data: associate,
        });

    });

    exports.getAssociates = asyncHandler(
        async (req, res) => {
    
            const associates =
                await User.find({
                    role: "associate",
                })
                    .select("-password")
                    .sort({
                        clientsCount: 1,
                    });
    
            res.status(200).json({
                success: true,
                count: associates.length,
                data: associates,
            });
    
        }
    );
    
    exports.getClients = asyncHandler(
        async (req, res) => {
    
            const clients =
                await User.find({
                    role: "client",
                })
                    .select("-password")
                    .populate(
                        "assignedAssociate",
                        "name email"
                    );
    
            res.status(200).json({
                success: true,
                count: clients.length,
                data: clients,
            });
    
        }
    );

    exports.reassignAssociate =
    asyncHandler(async (req, res) => {

        const { clientId } = req.params;

        const { newAssociateId } = req.body;

        // validate client
        const client =
            await User.findById(clientId);

        if (!client) {
            throw new AppError(
                "Client not found",
                404
            );
        }

        if (client.role !== "client") {
            throw new AppError(
                "User is not a client",
                400
            );
        }

        // validate new associate
        const newAssociate =
            await User.findById(
                newAssociateId
            );

        if (!newAssociate) {
            throw new AppError(
                "Associate not found",
                404
            );
        }

        if (
            newAssociate.role !==
            "associate"
        ) {
            throw new AppError(
                "User is not an associate",
                400
            );
        }

        if (!newAssociate.isAvailable) {
            throw new AppError(
                "Associate is unavailable",
                400
            );
        }

        // old associate
        const oldAssociateId =
            client.assignedAssociate;

        // prevent reassignment to same associate
        if (
            oldAssociateId &&
            oldAssociateId.toString() ===
                newAssociateId
        ) {
            throw new AppError(
                "Client already assigned to this associate",
                400
            );
        }

        // decrement old associate workload
        if (oldAssociateId) {

            await User.findByIdAndUpdate(
                oldAssociateId,
                {
                    $inc: {
                        clientsCount: -1,
                    },
                }
            );

        }

        // increment new associate workload
        await User.findByIdAndUpdate(
            newAssociateId,
            {
                $inc: {
                    clientsCount: 1,
                },
            }
        );

        // assign new associate
        client.assignedAssociate =
            newAssociateId;

        await client.save();

        res.status(200).json({
            success: true,
            message:
                "Associate reassigned successfully",
        });

        await createAuditLog({
            action: "ASSOCIATE_REASSIGNED",
        
            performedBy: req.user.userId,
        
            targetUser: client._id,
        
            details: {
                oldAssociateId,
                newAssociateId,
            },
        });

    });

    exports.getAllSubscriptions =
    asyncHandler(async (req, res) => {

        const subscriptions =
            await Subscription.find()

                .populate(
                    "clientId",
                    "name email assignedAssociate"
                )

                .populate(
                    "planId",
                    "name price jobLimitPerDay"
                )

                .sort({
                    createdAt: -1,
                });

        res.status(200).json({
            success: true,
            count: subscriptions.length,
            data: subscriptions,
        });

    });

    exports.getAllPayments =
    asyncHandler(async (req, res) => {

        const payments =
            await Payment.find()

                .populate(
                    "user",
                    "name email role"
                )

                .populate(
                    "plan",
                    "name price"
                )

                .sort({
                    createdAt: -1,
                });

        // revenue metrics
        const successfulPayments =
            payments.filter(
                payment =>
                    payment.status ===
                    "success"
            );

        const totalRevenue =
            successfulPayments.reduce(
                (sum, payment) =>
                    sum + payment.amount,
                0
            );

        res.status(200).json({
            success: true,

            metrics: {
                totalPayments:
                    payments.length,

                successfulPayments:
                    successfulPayments.length,

                totalRevenue,
            },

            data: payments,
        });

    });

exports.getAuditLogs = asyncHandler(async (req, res) => {
    const logs = await AuditLog.find()
        .populate("performedBy", "name email role")
        .populate("targetUser", "name email role")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: logs.length,
        data: logs,
    });
});