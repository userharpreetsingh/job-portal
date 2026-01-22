import mongoose from "mongoose"
import validator from "validator"

const applicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[true,"please provide your name"],
        minLength: [3, "name must contain atleast 3 character"],
        maxLength: [30, "name does not exceed 30 character"],
    },
    email: {
        type: String,
        required:[true,"please provide your name"],
        validator:[validator.isEmail,"please provide a valid email"],
    },
    coverLetter:{
        type:String,
        required:[true,"please provide cover letter"],
    },
    phone:{
        type:Number,
        required:[true,"please provide your phone number"],
    },
    address:{
        type:String,
        required:[true,"please provide your address"],
    },
    resume:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        },
    },
    applicantId:{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        role:{
            type:String,
            enum:["Job Seeker"],
            required:true,
        }
    },
    employerId:{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        role:{
            type:String,
            enum:["employer"],
            required:true,
        }
    }
});
export const Application = mongoose.Schema("Application",applicationSchema)