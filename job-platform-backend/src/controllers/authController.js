const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req,res) => {
    try{
        const {email, password} = req.body;

        //check if user exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invaild Credentials"});
        }

        //compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message: "Invalid Credentials"});
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
    }catch(error){
        res.status(500).json({message: "Server error",error});
    }
};

exports.registerClient = async (req,res) => {
    try{
        const {name, email, password} = req.body;

        //check if user exists
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({message: "User already exists"});
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
    }catch(error){
        res.status(500).json({message: "Server error", error});
    }
};