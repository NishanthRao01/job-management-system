const User = require("../models/User");
const AppError = require("../utils/AppError");

const assignAssociate = async () => {
    const associate = await User.find({
        role: "associate",
        isAvailable: true,
    })
        .sort({ clientsCount: 1})
        .limit(1);
    if(!associate.length){
        throw new AppError("No associate available");
    }
    return associate[0];
};
module.exports = assignAssociate;