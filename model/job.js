import mongoose from "mongoose"

const jobSchema= new mongoose.Schema({
    title:{
        type:String,
        required:[true,"please provide job title"],
        minLength:[3,"job title must constain atleast 3 title"],
        maxLength:[30,"job title does not excceds 30 characters"],
    },
    description:{
        type:String,
        required:[true,"please provide job description"],
        minLength:[3,"job description must constain atleast 3 characters"],
        maxLength:[350,"job description does not excceds 30 characters"],
    },
    category:{
        type:String,
        required:[true,"job catgory required"],
    },
    country:{
        type:String,
        required:[true,"job country is required"],
    },
    city:{
        type:String,
        required:[true,"job city is required"],
    },
    location:{
        type:String,
        required:[true,"job city is required"],
    },
    fixedsalary:{
        type:Number,
        minLength:[4,"job fixedsalary must constain atleast 4 characters"],
        maxLength:[9,"job fixedsalary does not excceds 9 characters"],
    },
    salaryFrom:{
        type:Number,
        minLength:[4,"salary from must conatin  atleast 4 digit"],
        maxLength:[9,"job salary from does not excceds 9 characters"],
    },
    salaryTo:{
        type:Number,
        minLength:[4,"salary from must conatin atleast 4 digit"],
        maxLength:[9,"job salary from does not excceds 9 characters"],
    },
    expired:{
        type:Number,
        default:false
    },
    jobPostedOn:{
        type:Date,
        default:Date.now,
    },
    postedBy:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    }
})

export const Job = mongoose.model("Job",jobSchema)