const Job = require("../models/Job");
const User = require("../models/User");
const mongoose = require("mongoose");
const APIFeatures = require("../utils/apiFeatures");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// CREATE JOB
exports.createJob = asyncHandler(async (req, res) => {
    const { clientId, company, role, jobLink } = req.body;
    const associateId = req.user.userId;

    const client = await User.findById(clientId);
    if (!client || client.role !== "client") {
        throw new AppError("Client not found", 404);
    }

    if (client.assignedAssociate?.toString() !== associateId) {
        throw new AppError("Not your client", 403);
    }

    const job = await Job.create({
        clientId,
        associateId,
        company,
        role,
        jobLink,
        appliedAt: new Date(),
    });

    res.status(201).json({
        success: true,
        message: "Job created successfully",
        data: job,
    });
});


// GET CLIENT JOBS
exports.getClientJobs = asyncHandler(async (req, res) => {
    if (req.user.role !== "client") {
        throw new AppError("Unauthorized access", 403);
    }

    const clientId = new mongoose.Types.ObjectId(req.user.userId);

    let baseQuery = Job.find({ clientId })
        .populate("clientId", "name email")
        .populate("associateId", "name email");

    const features = new APIFeatures(baseQuery, req.query)
        .filter()
        .sort()
        .paginate();

    const jobs = await features.query;

    res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs,
    });
});


// GET ASSOCIATE JOBS
exports.getAssociateJobs = asyncHandler(async (req, res) => {
    if (req.user.role !== "associate") {
        throw new AppError("Unauthorized access", 403);
    }

    const associateId = new mongoose.Types.ObjectId(req.user.userId);

    let baseQuery = Job.find({ associateId })
        .populate("clientId", "name email")
        .populate("associateId", "name email");

    const features = new APIFeatures(baseQuery, req.query)
        .filter()
        .sort()
        .paginate();

    const jobs = await features.query;

    res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs,
    });
});


// GET SINGLE JOB
exports.getSingleJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new AppError("Invalid Job ID", 400);
    }

    const job = await Job.findById(jobId);

    if (!job) {
        throw new AppError("Job not found", 404);
    }

    const userId = req.user.userId;
    const role = req.user.role;

    if (
        role !== "admin" &&
        job.clientId.toString() !== userId &&
        job.associateId.toString() !== userId
    ) {
        throw new AppError("Unauthorized access", 403);
    }

    res.status(200).json({
        success: true,
        data: job,
    });
});


// UPDATE JOB STATUS
exports.updateJobStatus = asyncHandler(async (req, res) => {
    const jobId = req.params.id;
    const { status } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
        throw new AppError("Job not found", 404);
    }

    const userId = req.user.userId;

    if (req.user.role !== "client" || job.clientId.toString() !== userId) {
        throw new AppError("Unauthorized access", 403);
    }

    job.status = status;
    await job.save();

    res.status(200).json({
        success: true,
        message: "Status updated",
        data: job,
    });
});


// ADD NOTE
exports.addNote = asyncHandler(async (req, res) => {
    const jobId = req.params.id;
    const { text } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
        throw new AppError("Job not found", 404);
    }

    const userId = req.user.userId;

    if (req.user.role !== "associate" || job.associateId.toString() !== userId) {
        throw new AppError("Unauthorized access", 403);
    }

    job.notes.push({ text });
    await job.save();

    res.status(200).json({
        success: true,
        message: "Note added",
        data: job,
    });
});