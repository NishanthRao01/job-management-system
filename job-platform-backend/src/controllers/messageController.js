const Message = require("../models/Message");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// GET MESSAGES BETWEEN CURRENT USER AND CONTACT
exports.getMessages = asyncHandler(async (req, res) => {
    const currentUserId = req.user.userId;
    const { contactId } = req.params;

    // Optional: add validation to ensure they have permission to chat
    // If client, contactId must be their assignedAssociate
    // If associate, currentUserId must be the assignedAssociate of contactId
    const currentUser = await User.findById(currentUserId);
    const contactUser = await User.findById(contactId);

    if (!currentUser || !contactUser) {
        throw new AppError("User not found", 404);
    }

    if (currentUser.role === "client" && currentUser.assignedAssociate?.toString() !== contactId) {
        throw new AppError("Unauthorized chat access", 403);
    }

    if (currentUser.role === "associate" && contactUser.assignedAssociate?.toString() !== currentUserId) {
        throw new AppError("Unauthorized chat access", 403);
    }

    const messages = await Message.find({
        $or: [
            { senderId: currentUserId, receiverId: contactId },
            { senderId: contactId, receiverId: currentUserId },
        ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
        success: true,
        data: messages,
    });
});
