const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
    try{
        let token;

        //get token from header
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];  //["Bearer", "TOKEN"]
        }
        if(!token){
            return res.status(401).json({message: "Not authorized, no token"});
        }
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        return res.status(401).json({message: "Token invalid"});
    }
};

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.roles)){
            return res.status(403).json({message: "Access denied"});
        }
        next();
    };
};