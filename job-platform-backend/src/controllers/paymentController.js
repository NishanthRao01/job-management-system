const razorpay = require("../config/razorpay");
const Plan = require("../models/Plan");
const Payment = require("../models/Payment");
const Subscription = require("../models/Subscription");
const {
    createSubscriptionForClient,
} = require("../services/subscriptionService");

const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const crypto = require("crypto");

exports.createOrder = asyncHandler(async (req, res) => {

    const { planId } = req.body;
    const userId = req.user.userId;

    // validate plan
    const plan = await Plan.findById(planId);

    if (!plan) {
        throw new AppError("Plan not found", 404);
    }

    const existingSubscription = await Subscription.findOne({
        clientId: userId,
        status: "active",
    });
    
    if (existingSubscription) {
        throw new AppError(
            "Active subscription already exists",
            400
        );
    }

    // create razorpay order
    const options = {
        amount: Math.round(plan.price * 100),
        currency: "INR",
        receipt: `rcpt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    // create pending payment record
    const payment = await Payment.create({
        user: userId,
        plan: plan._id,
        amount: plan.price,
        currency: "INR",
        razorpayOrderId: order.id,
        status: "pending"
    });

    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_KEY_ID,
        order,
        paymentId: payment._id,
    });

});


exports.verifyPayment = asyncHandler(async (req, res) => {

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    } = req.body;

    // generate expected signature
    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    // verify signature
    if (generatedSignature !== razorpay_signature) {
        throw new AppError("Invalid payment signature", 400);
    }

    // find payment record
    const payment = await Payment.findOne({
        razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
        throw new AppError("Payment record not found", 404);
    }

    // prevent double processing
    if (payment.status === "success") {
        return res.status(200).json({
            success: true,
            message: "Payment already verified",
        });
    }

    // update payment
    payment.status = "success";
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;

    await payment.save();
    await createSubscriptionForClient(
        payment.user,
        payment.plan
    );
    await createAuditLog({
        action: "PAYMENT_VERIFIED",
    
        performedBy: payment.user,
    
        targetUser: payment.user,
    
        details: {
            paymentId: payment._id,
            amount: payment.amount,
            razorpayPaymentId,
        },
    });

    res.status(200).json({
        success: true,
        message: "Payment verified successfully",
    });

});
