const Job = require("../models/Job");
const User = require("../models/User");
const mongoose = require("mongoose");
const APIFeatures = require("../utils/apiFeatures");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const {getCache, setCache, deleteCache} = require("../utils/cache");

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

    //Cache Invalidation
    await deleteCache(`jobs:client:${clientId}:*`);
    await deleteCache(`jobs:associate:${associateId}:*`);

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

    const userId = req.user.userId;
    const clientId = new mongoose.Types.ObjectId(userId);
    const cacheKey = `jobs:client:${userId}:${JSON.stringify(req.query)}`;

    //check cache
    const cachedData = await getCache(cacheKey);
    if(cachedData){
        console.log("Redis Hit");
        return res.status(200).json({
            success: true,
            count: cachedData.count,
            data: cachedData.data
        });
    }

    //DB query
    let baseQuery = Job.find({ clientId })
        .populate("clientId", "name email")
        .populate("associateId", "name email");

    const features = new APIFeatures(baseQuery, req.query)
        .filter()
        .sort()
        .paginate();

    const jobs = await features.query;
    
    const response = {
        count: jobs.length,
        data: jobs
    };

    //setCache
    await setCache(cacheKey,response);

    res.status(200).json({
        success: true,
        ...response
    });
});


// GET ASSOCIATE JOBS
exports.getAssociateJobs = asyncHandler(async (req, res) => {
    if (req.user.role !== "associate") {
        throw new AppError("Unauthorized access", 403);
    }

    const userId = req.user.userId;
    const associateId = new mongoose.Types.ObjectId(userId);
    const cacheKey = `jobs:associate:${userId}:${JSON.stringify(req.query)}`;

    const cachedData = await getCache(cacheKey);
    if(cachedData){
        console.log("Redis Hit");
        return res.status(200).json({
            success: true,
            count: cachedData.count,
            data: cachedData.data
        });
    }

    let baseQuery = Job.find({ associateId })
        .populate("clientId", "name email")
        .populate("associateId", "name email");

    const features = new APIFeatures(baseQuery, req.query)
        .filter()
        .sort()
        .paginate();

    const jobs = await features.query;

    const response = {
        count: jobs.length,
        data: jobs
    };

    await setCache(cacheKey,response);

    res.status(200).json({
        success: true,
        ...response
    });
});


// GET SINGLE JOB
exports.getSingleJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) { //this doesnt hit db it only checks if it is 24 chars long and if it is a valid hex string 
        throw new AppError("Invalid Job ID", 400);
    }

    const cacheKey = `job:${jobId}`;
    const cachedJob = await getCache(cacheKey);

    if(cachedJob){
        const userId = req.user.userId;
        const role = req.user.role;
        if (
            role !== "admin" &&
            cachedJob.clientId.toString() !== userId &&
            cachedJob.associateId.toString() !== userId
        ){
            throw new AppError("unauthorized access", 403);
        }

        return res.status(200).json({
            success: true,
            data: cachedJob
        });
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

    await setCache(cacheKey, job.toObject());

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

    await deleteCache(`jobs:client:${job.clientId}:*`);
    await deleteCache(`job:${jobId}`);

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

    await deleteCache(`jobs:associate:${job.associateId}:*`);
    await deleteCache(`job:${jobId}`);

    res.status(200).json({
        success: true,
        message: "Note added",
        data: job,
    });
});