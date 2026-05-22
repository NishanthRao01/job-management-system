const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
        required: true,
    },

    amount: {
        type: Number,
        required: true,
    },

    currency: {
        type: String,
        default: "INR",
    },

    razorpayOrderId: {
        type: String,
        required: true,
    },

    razorpayPaymentId: {
        type: String,
    },

    razorpaySignature: {
        type: String,
    },

    status: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending",
    },

    webhookProcessed: {
        type: Boolean,
        default: false
    },

    webhookEventId: String

}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);