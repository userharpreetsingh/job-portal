import {catchAysncError} from "../middleware/catchAysncError.js"
// import { ErrorHandler } from "../middleware/error.js"
import { Job } from "../model/job.js" 

export const  getAllJobs = catchAysncError(async(req,res,next)=>{
    const jobs = await Job.find({expired:false});
    return res.status(200).json({
        success:true,
        jobs,
    })
})