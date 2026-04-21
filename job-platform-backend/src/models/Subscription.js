const mongoose = require("mongoose");
const subscriptionSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
        required: true
    },
    status: {
        type: String,
        enum: ["active","expired"],
        default: "active"
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true,
    },
},{timestamps: true});

module.exports = mongoose.model("Subscription",subscriptionSchema);