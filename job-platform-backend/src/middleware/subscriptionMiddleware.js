const Subscription = require("../models/Subscription");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const checkSubscription = asyncHandler(async (req,res,next) => {
    let clientId;
    
    if (req.user.role === "associate") {
        clientId = req.body.clientId;
    }

    if (req.user.role === "client") {
        clientId = req.user.userId;
    }
    if(!clientId){
        throw new AppError("Client ID is required",400);
    }
    const sub = await Subscription.findOne({
        clientId,
        status: "active",
        endDate: { $gt: new Date() }
    });
    if(!sub){
        throw new AppError("No active subscription for this client", 403);
    }
    next();
});

module.exports = checkSubscription;