const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
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
                assignedAssociate: user.assignedAssociate || null,
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

exports.forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (user) {
        // Generate secure, cryptographically random token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash token using SHA-256 and set expiry (10 minutes)
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now
        await user.save();

        // Print reset event to server console in development only (safe version, hiding the token)
        if (process.env.NODE_ENV === "development") {
            console.log("\n========================================");
            console.log("PASSWORD RESET REQUEST RECEIVED (DEVELOPMENT ONLY)");
            console.log(`Email: ${email}`);
            console.log("Status: Token generated successfully (hidden for security)");
            console.log("========================================\n");
        }
    }

    res.status(200).json({
        message: "If an account with that email exists, a password reset link has been sent.",
    });
});

exports.resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    // Hash incoming token using SHA-256
    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    // Find user with matching hashed token and expiration greater than now
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        throw new AppError("Invalid or expired token.", 400);
    }

    // Reject resetting to the same password
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
        throw new AppError("New password cannot be the same as the old password.", 400);
    }

    // Hash the new password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password, clear token fields, and save once
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
        message: "Password reset successful.",
    });
});