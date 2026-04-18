const Job = require("../models/Job");
const User = require("../models/User");
const mongoose = require("mongoose");
const APIFeatures = require("../utils/apiFeatures");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

exports.createJob = asyncHandler(async (req,res) => {
    const {clientId, company, role, jobLink} =req.body;
    const associateId = req.user.userId;
    if (!clientId || !company || !role || !jobLink) {
        throw new AppError("All fields are required", 400);
    }
    //Check client exists
    const client = await User.findById(clientId);
    if(!client || client.role !== "client"){
        throw new AppError("Unauthorized access", 403);
    }

    //Check association
    if(client.assignedAssociate?.toString() !== associateId){
        throw new AppError("Not your client", 403);
    }

        //Create job
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
        message: "Job Created Successfully",
        data: job
    });
});

exports.getClientJobs = asyncHandler(async (req,res) => {
        //Check user exists & role
        if(req.user.role !== "client"){
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
            jobs
        });
});

exports.getAssociateJobs = asyncHandler(async (req,res) => {
        if(req.user.role !== "associate"){
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
            data: jobs
        });
});

//“req.user.userId is typically a string extracted from JWT, while new mongoose.Types.ObjectId() converts it into a MongoDB ObjectId. Mongoose usually auto-casts strings, but using ObjectId explicitly ensures type correctness in strict or complex queries.”

exports.getSingleJob = asyncHandler(async (req,res) => {
        const jobId =  req.params.id;
        //Validate Id because value comes from params checks for valid format
        if(!mongoose.Types.ObjectId.isValid(jobId)){
            throw new AppError("Invalid Job ID", 400);
        }

        const job = await Job.findById(jobId);
        if(!job){
            throw new AppError("Job not Found", 404);
        }
        const userId = req.user.userId;
        const role = req.user.role;

        if(role !== "admin" && job.clientId.toString() !== userId && job.associateId.toString() !== userId){
            throw new AppError("Unauthorized access", 403);
        }

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: job
        });
});

exports.updateJobStatus = asyncHandler(async (req,res) => {
        const jobId = req.params.id;
        const { status } = req.body;
        const job = await Job.findById(jobId);
        if(!job){
            throw new AppError("Job not found", 404);
        }
        const userId = req.user.userId;
        if(req.user.role !== "client" || job.clientId.toString() !== userId){
            throw new AppError("Unauthorized access", 403);
        }
        const allowedStatus = ["applied","interview","rejected","offer"];
        if(!allowedStatus.includes(status)){
            throw new AppError("Invalid Status", 400);
        }
        job.status = status;
        await job.save();

        res.status(200).json({
            success: true,
            message: "Status updated",
            data: job
        });
});

exports.addNote = asyncHandler(async (req,res) => {
        const jobId = req.params.id;
        const {text} = req.body;
        if(!text){
            throw new AppError("Note text required", 400);
        }
        if (text.length > 500) {
            throw new AppError("Note too long", 400);
        }
        const job = await Job.findById(jobId);
        if(!job){
            throw new AppError("Job not found", 404);
        }
        const userId = req.user.userId;
        if(req.user.role !== "associate" || job.associateId.toString() !== userId){
            throw new AppError("Unauthorized access", 403);
        }
        job.notes.push({text});
        await job.save();
        res.status(200).json({
            success: true,
            message: "Note added",
            data: job
        });
});
