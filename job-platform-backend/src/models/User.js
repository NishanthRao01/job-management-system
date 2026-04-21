const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["client","associate"], //allows only specifed values ensuring data consistency
        required: true,
    },
    clientsCount: {
        type: Number,
        default: 0
    },
    assignedAssociate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
},{ timestamps:  true }); // automatically adds createdAt, updatedAt

module.exports = mongoose.model("User", userSchema);
