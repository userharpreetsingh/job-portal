import {catchAysncError} from "../middleware/catchAysncError.js"
import { ErrorHandler } from "../middleware/error.js"
import { Job } from "../model/job.js" 

export const  getAllJobs = catchAysncError(async(req,res,next)=>{
    const jobs = await Job.find({expired:false});
    return res.status(200).json({
        success:true,
        jobs,
    })
});

export const postJob=catchAysncError(async(req,res,next)=>{
  const {role}=req.user
  if(role === "Job Seeker"){
    return next (new ErrorHandler("job seeker is not aloowed to access this resources",400))
  }
  const {title,description,category,country,city,location,fixedSalary,salaryFrom,salaryTo} =req.body
  if(!title || !description || !category || !country || !city || !location){
    return next(new ErrorHandler("please provide full  job detail",400))
  }
  if((!salaryFrom ||!salaryTo) &&(!fixedSalary)){
    return next (new ErrorHandler("please provide fixed salary or ranged salary",400))
  }
  if(salaryFrom && salaryTo && fixedSalary){
    return next (new ErrorHandler("cannot enter fixed salary or ranged salary together!"))
  }
  const postedBy=req.user._id
  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy,
  })
  res.status(200).json({
    success:true,
    message:"job created succesfully",
    job
  })
})

export const getMyJobs=catchAysncError(async(req,res,next)=>{
    const {role} =req.user;
    if(role === "Job Seeker"){
    return next (new ErrorHandler("job seeker is not aloowed to access this resources",400))
  }
  const myJobs=await Job.find({postedBy:req.user._id});
  res.status(200).json({
    success:true,
    myJobs,
  })
})

export const updateJob = catchAysncError(async(req,res,next)=>{
  const {role}=req.user;
  if(role === "Job Seeker"){
    return next (new ErrorHandler("job seeker is not aloowed to access this resources",400))
  }
  const {id} = req.params;
  let job = await Job.findById(id)
  if(!job){
    return next(new ErrorHandler("oops job not found!",404))
  }
  job = await Job.findByIdAndUpdate(id,req.body,{
    new:true,
    runValidators:true,
    useFindAndModify:false,
  })
  res.status(200).json({
    success:true,
    job,
    message:"job updated successfully",
  });
})

export const deleteJob =catchAysncError(async(req,res)=>{
  const {role}=req.user;
  if(role === "Job Seeker"){
    return next (new ErrorHandler("job seeker is not aloowed to access this resources",400))
  }
  const {id} = req.params;
  let job = await Job.findById(id)
  if(!job){
    return next(new ErrorHandler("oops job not found!",404))
  }
  await Job.deleteOne();
  res.status(200).json({
    success:true,
    message:"job deleted successfully"
  })
})