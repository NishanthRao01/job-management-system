const Plan = require("../models/Plan");
const asyncHandler = require("../utils/asyncHandler");

// GET ALL PLANS
exports.getPlans = asyncHandler(async (req, res) => {
    const plans = await Plan.find().sort({ price: 1 });
    
    res.status(200).json({
        success: true,
        count: plans.length,
        data: plans
    });
});
