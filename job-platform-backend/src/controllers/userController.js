const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// GET ASSIGNED CLIENTS FOR ASSOCIATE
exports.getAssignedClients = asyncHandler(async (req, res) => {
    if (req.user.role !== "associate") {
        throw new AppError("Unauthorized access", 403);
    }

    const associateId = req.user.userId;
    
    const clients = await User.find({ 
        role: "client", 
        assignedAssociate: associateId 
    }).select("-password");

    res.status(200).json({
        success: true,
        count: clients.length,
        data: clients
    });
});
