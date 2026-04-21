const { z } = require("zod");

exports.createJobSchema = z.object({
    clientId: z.string().min(1, "Client ID is required"),
    company: z.string().min(1, "Company is required"),
    role: z.string().min(1, "Role is required"),
    jobLink: z.string().url("Invalid job link"),
});

exports.updateStatusSchema = z.object({
    status: z.enum(["applied", "interview", "rejected", "offer"], {
        errorMap: () => ({ message: "Invalid status value" }),
    }),
});

exports.noteSchema = z.object({
    text: z.string().min(1, "Note required").max(500, "Note too long"),
});