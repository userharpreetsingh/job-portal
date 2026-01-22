import { catchAysncError } from "../middleware/catchAysncError.js";
import { ErrorHandler } from "../middleware/error.js"
import { Application } from "../model/applicationSchema.js";


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


