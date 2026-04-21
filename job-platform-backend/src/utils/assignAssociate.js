const User = require("../models/User");
const assignAssociate = async () => {
    const associate = await User.find({role: "associate"})
        .sort({ clientsCount: 1})
        .limit(1);
    if(!associate.length){
        throw new AppError("No associate available");
    }
    return associate[0];
};
module.exports = assignAssociate;