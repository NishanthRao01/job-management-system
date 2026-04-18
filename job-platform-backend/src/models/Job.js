const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema(
    {
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        associateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        company: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["applied","interview","rejected","offer"],
            default: "applied"
        },

        jobLink: String,

        descriptionSnippet: String,

        keywords: [String],

        appliedAt: Date,

        notes: [
            {
                text: {
                    type: String,
                    required: true
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {timestamps: true}
);

module.exports = mongoose.model("Job",jobSchema);