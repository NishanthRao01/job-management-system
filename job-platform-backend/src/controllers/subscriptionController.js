const Subscription = require("../models/Subscription");

const {
    createSubscriptionForClient,
} = require("../services/subscriptionService");

const asyncHandler = require("../utils/asyncHandler");

exports.createSubscription = asyncHandler(
    async (req, res) => {

        const { planId } = req.body;

        const clientId = req.user.userId;

        const subscription =
            await createSubscriptionForClient(
                clientId,
                planId
            );

        res.status(201).json({
            success: true,
            message:
                "Subscription created successfully",
            data: subscription,
        });

    }
);

exports.getMySubscription = asyncHandler(
    async (req, res) => {

        const clientId = req.user.userId;

        const subscription =
            await Subscription.findOne({
                clientId,
                status: "active",
            })
                .populate("planId")
                .populate(
                    "clientId",
                    "name email assignedAssociate"
                );

        res.status(200).json({
            success: true,
            data: subscription,
        });

    }
);