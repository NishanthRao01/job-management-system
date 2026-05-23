const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");
const User = require("../models/User");

const assignAssociate = require("../utils/assignAssociate");

const AppError = require("../utils/AppError");

const createSubscriptionForClient = async (
    clientId,
    planId
) => {

    const plan = await Plan.findById(planId);

    if (!plan) {
        throw new AppError("Plan not found", 404);
    }

    // prevent duplicate active subscriptions
    const existingSubscription =
        await Subscription.findOne({
            clientId,
            status: "active",
        });

    if (existingSubscription) {
        throw new AppError(
            "Active subscription already exists",
            400
        );
    }

    // assign associate
    const associate = await assignAssociate();

    // calculate dates
    const startDate = new Date();

    const endDate = new Date();

    endDate.setDate(startDate.getDate() + 30);

    // create subscription
    const subscription =
        await Subscription.create({
            clientId,
            planId,
            startDate,
            endDate,
        });

    // assign associate to client
    await User.findByIdAndUpdate(clientId, {
        assignedAssociate: associate._id,
    });

    // increment associate workload
    await User.findByIdAndUpdate(
        associate._id,
        {
            $inc: { clientsCount: 1 },
        }
    );

    return subscription;
};

module.exports = {
    createSubscriptionForClient,
};