const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

exports.login = asyncHandler(async (req,res) => {
        const {email, password} = req.body;

        //check if user exists
        const user = await User.findOne({email});
        if(!user){
            throw new AppError("Invalid Credentials", 400);
        }

        //compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            throw new AppError("Invalid Credentials", 400);
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        res.json({
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
            },
        });
});

exports.registerClient = asyncHandler(async (req,res) => {
        const {name, email, password} = req.body;

        //check if user exists
        const existingUser = await User.findOne({email});
        if(existingUser) {
            throw new AppError("User already exists", 400);
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "client",
        });
        res.status(201).json({
            message: "Client registered successfully",
            user,
        });
});