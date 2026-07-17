const { z } = require("zod");

exports.forgotPasswordSchema = z.object({
    email: z.string().trim().email("Invalid email address"),
});

exports.resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});
