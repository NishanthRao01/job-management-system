const { z } = require("zod");

const resumeFileSchema = z.object({
    url: z.string().url("Invalid file URL"),
    publicId: z.string().min(1, "Public ID is required"),
    filename: z.string().min(1, "Filename is required"),
    uploadedAt: z.string().or(z.date()).optional(),
    mimeType: z.string().optional(),
    fileSize: z.number().positive().optional()
}).optional().nullable();

exports.createJobSchema = z.object({
    clientId: z.string().min(1, "Client ID is required"),
    company: z.string().min(1, "Company is required"),
    role: z.string().min(1, "Role is required"),
    jobLink: z.string().url("Invalid job link").optional().or(z.literal("")),
    resume: z.string().url("Invalid resume link").optional().or(z.literal("")),
    resumeFile: resumeFileSchema,
    descriptionSnippet: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    initialNote: z.string().optional(),
});

exports.updateJobSchema = z.object({
    company: z.string().min(1, "Company is required").optional(),
    role: z.string().min(1, "Role is required").optional(),
    jobLink: z.string().url("Invalid job link").optional().or(z.literal("")),
    resume: z.string().url("Invalid resume link").optional().or(z.literal("")).nullable(),
    resumeFile: resumeFileSchema,
    descriptionSnippet: z.string().optional().nullable(),
    keywords: z.array(z.string()).optional(),
});

exports.updateStatusSchema = z.object({
    status: z.enum(["applied", "interview", "rejected", "offer"], {
        errorMap: () => ({ message: "Invalid status value" }),
    }),
});

exports.noteSchema = z.object({
    text: z.string().min(1, "Note required").max(500, "Note too long"),
});