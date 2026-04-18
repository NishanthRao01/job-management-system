const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

exports.protect = asyncHandler((req, res, next) => {
        let token;

        //get token from header
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];  //["Bearer", "TOKEN"]
        }
        if(!token){
            throw new AppError("Not authorized, No token", 401);
        }
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
});

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        const userRole = req.user.role.trim().toLowerCase();
        const allowedRoles = roles.map(r => r.toLowerCase());
        if(!allowedRoles.includes(userRole)){
            throw new AppError("Access deneid", 403);
        }
        next();
    };
};