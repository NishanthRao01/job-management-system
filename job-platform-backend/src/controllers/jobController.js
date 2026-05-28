const Job = require("../models/Job");
const User = require("../models/User");
const mongoose = require("mongoose");
const APIFeatures = require("../utils/apiFeatures");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const {getCache, setCache, deleteCache} = require("../utils/cache");

// CREATE JOB
exports.createJob = asyncHandler(async (req, res) => {
    const { clientId, company, role, jobLink, resume, resumeFile, descriptionSnippet, keywords, initialNote } = req.body;
    const associateId = req.user.userId;

    const client = await User.findById(clientId);
    if (!client || client.role !== "client") {
        throw new AppError("Client not found", 404);
    }

    if (client.assignedAssociate?.toString() !== associateId) {
        throw new AppError("Not your client", 403);
    }

    const jobData = {
        clientId,
        associateId,
        company,
        role,
        jobLink,
        resumeFile,
        resume: resumeFile ? resumeFile.url : (resume || ""),
        descriptionSnippet,
        keywords,
        appliedAt: new Date(),
    };

    if (initialNote && initialNote.trim().length > 0) {
        jobData.notes = [{ text: initialNote }];
    }

    let job;
    try {
        job = await Job.create(jobData);
    } catch (err) {
        // Rollback logic: delete uploaded Cloudinary asset if saving fails
        if (resumeFile && resumeFile.publicId) {
            const { deleteResume } = require("../services/cloudinaryService");
            await deleteResume(resumeFile.publicId, resumeFile.resourceType || "raw");
        }
        throw err;
    }

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

// Helper for filename normalization
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w\-]+/g, "") // Remove all non-word chars
        .replace(/\-\-+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start
        .replace(/-+$/, ""); // Trim - from end
};

// UPLOAD RESUME
exports.uploadResumeRoute = asyncHandler(async (req, res) => {
    const file = req.file;
    
    // Normalize filename
    const ext = file.originalname.split(".").pop().toLowerCase();
    let targetFilename = "";
    
    if (req.body.role && req.body.company) {
        targetFilename = `${slugify(req.body.role)}-${slugify(req.body.company)}.${ext}`;
    } else {
        const baseName = file.originalname.replace(/\.[^/.]+$/, "");
        targetFilename = `${slugify(baseName)}.${ext}`;
    }

    const { uploadResume } = require("../services/cloudinaryService");
    const result = await uploadResume(file.buffer, targetFilename);

    // Generate secure URL with fl_attachment:<clean-name-with-extension>
    let downloadUrl = result.secure_url;
    if (result.secure_url && result.secure_url.includes("/upload/")) {
      downloadUrl = result.secure_url.replace("/upload/", `/upload/fl_attachment:${targetFilename}/`);
    }

    res.status(200).json({
        success: true,
        message: "Resume uploaded successfully",
        data: {
            url: result.secure_url,
            downloadUrl: downloadUrl,
            publicId: result.public_id,
            filename: targetFilename,
            uploadedAt: new Date(),
            mimeType: file.mimetype,
            fileSize: file.size,
            resourceType: result.resource_type
        }
    });
});

// UPDATE JOB
exports.updateJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id;
    const { company, role, jobLink, resume, resumeFile, descriptionSnippet, keywords } = req.body;
    const associateId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new AppError("Invalid Job ID", 400);
    }

    const job = await Job.findById(jobId);
    if (!job) {
        throw new AppError("Job not found", 404);
    }

    if (job.associateId.toString() !== associateId) {
        throw new AppError("Unauthorized access", 403);
    }

    const oldPublicId = job.resumeFile?.publicId;
    const oldResourceType = job.resumeFile?.resourceType || "raw";

    // Update basic fields
    if (company !== undefined) job.company = company;
    if (role !== undefined) job.role = role;
    if (jobLink !== undefined) job.jobLink = jobLink;
    if (descriptionSnippet !== undefined) job.descriptionSnippet = descriptionSnippet;
    if (keywords !== undefined) job.keywords = keywords;

    // Handle resume legacy link & resumeFile
    if (resumeFile !== undefined) {
        job.resumeFile = resumeFile;
        // set compatibility fallback url
        job.resume = resumeFile ? resumeFile.url : "";
    } else if (resume !== undefined) {
        job.resume = resume;
    }

    try {
        await job.save();
    } catch (err) {
        // Rollback: if database save fails, but we had uploaded a new file, clean it up!
        if (resumeFile && resumeFile.publicId && resumeFile.publicId !== oldPublicId) {
            const { deleteResume } = require("../services/cloudinaryService");
            await deleteResume(resumeFile.publicId, resumeFile.resourceType || "raw");
        }
        throw err;
    }

    // Cleanup logic: If saving succeeded AND we replaced/removed the file, delete the old file
    if (oldPublicId) {
        const isRemoved = resumeFile === null;
        const isReplaced = resumeFile && resumeFile.publicId !== oldPublicId;

        if (isRemoved || isReplaced) {
            const { deleteResume } = require("../services/cloudinaryService");
            await deleteResume(oldPublicId, oldResourceType);
        }
    }

    // Cache Invalidation
    await deleteCache(`jobs:client:${job.clientId}:*`);
    await deleteCache(`jobs:associate:${associateId}:*`);
    await deleteCache(`job:${jobId}`);

    res.status(200).json({
        success: true,
        message: "Job updated successfully",
        data: job,
    });
});

// DELETE JOB
exports.deleteJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id;
    const associateId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new AppError("Invalid Job ID", 400);
    }

    const job = await Job.findById(jobId);
    if (!job) {
        throw new AppError("Job not found", 404);
    }

    if (job.associateId.toString() !== associateId) {
        throw new AppError("Unauthorized access", 403);
    }

    // Delete attachment from Cloudinary if it exists
    if (job.resumeFile && job.resumeFile.publicId) {
        const { deleteResume } = require("../services/cloudinaryService");
        await deleteResume(job.resumeFile.publicId, job.resumeFile.resourceType || "raw");
    }

    await Job.findByIdAndDelete(jobId);

    // Cache Invalidation
    await deleteCache(`jobs:client:${job.clientId}:*`);
    await deleteCache(`jobs:associate:${associateId}:*`);
    await deleteCache(`job:${jobId}`);

    res.status(200).json({
        success: true,
        message: "Job deleted successfully"
    });
});