import { catchAysncError } from "../middleware/catchAysncError.js";
import { ErrorHandler } from "../middleware/error.js"
import { Application } from "../model/applicationSchema.js";
import cloudinary from "cloudinary"
import {Job} from "../model/job.js"

export const empolyerGetAllApplications = catchAysncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(new ErrorHandler("job seeker is not allowed to access this resources", 400))
    }
    const {_id} =req.user;
    const applications = await Application.find({'employerID.user':_id})
    res.status(200).json({
        success:true,
        applications,
    })
});


export const jobseekerGetAllApplications = catchAysncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
        return next(new ErrorHandler("Employer is not allowed to access this resources", 400))
    }
    const {_id} =req.user;
    const applications = await Application.find({'applicantID.user':_id})
    res.status(200).json({
        success:true,
        applications,
    })
});



export const jobSeekerDeleteApplication=catchAysncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
        return next(new ErrorHandler("Employer is not allowed to access this resources", 400))
    }
    const {id}=req.params
    const application = await Application.findById(id)
    if(!application){
        return next(new ErrorHandler("Oops job not found!",400))
    }
    await application.deleteOne()
    res.status(200).json({
        success:true,
        message:"application deleted successfully",
    });
});


export const postApplication = catchAysncError(async (req, res, next) => {

    const { role } = req.user;
    if (role === "Employer") {
        return next(
            new ErrorHandler("Employer is not allowed to access this resource", 403)
        );
    }

    // Check resume
    if (!req.files || !req.files.resume) {
        return next(new ErrorHandler("Resume file is required", 400));
    }

    const { resume } = req.files;

    const allowedFormats = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedFormats.includes(resume.mimetype)) {
        return next(
            new ErrorHandler("Invalid file type. Upload PDF or DOC/DOCX", 400)
        );
    }

    // Upload to cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
        resume.tempFilePath,
        { folder: "resumes" }
    );

    if (!cloudinaryResponse) {
        return next(new ErrorHandler("Failed to upload resume", 500));
    }

    const { name, email, coverLetter, phone, address, jobId } = req.body;

    if (!name || !email || !coverLetter || !phone || !address || !jobId) {
        return next(new ErrorHandler("Please fill all fields", 400));
    }

    const jobDetails = await Job.findById(jobId);
    if (!jobDetails) {
        return next(new ErrorHandler("Job not found", 404));
    }

    const application = await Application.create({
        name,
        email,
        coverLetter,
        phone,
        address,
        jobId,
        applicantID: {
            user: req.user._id,
            role: "Job Seeker",
        },
        employerID: {
            user: jobDetails.postedBy,
            role: "Employer",
        },
        resume: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });

    res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        application,
    });
});
