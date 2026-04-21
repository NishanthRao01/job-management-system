const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");
const User = require("../models/User");
const assignAssociate = require("../utils/assignAssociate");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

exports.createSubscription = asyncHandler(async (req,res) =>{
    const {planId} = req.body;
    const clientId = req.user.userId;
    
    const plan = await Plan.findById(planId);
    if(!plan){
        throw new AppError("Plan not found",404);
    }

    const existing = await Subscription.findOne({
        clientId,
        status: "active"
    });

    if(existing){
        throw new AppError("Active subscription already exists",400);
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);

    const associate = await assignAssociate();
    const subscription = await Subscription.create({
        clientId,
        planId,
        startDate,
        endDate
    });

    await User.findByIdAndUpdate(clientId,{
        assignedAssociate: associate._id,
    });

    await User.findByIdAndUpdate(associate._id, {
        $inc: {clientsCount: 1}, // increment  by 1
    });

    res.status(201).json({
        success: true,
        message: "Subscription created successfully",
        data: subscription,
    });
});