
import { catchAysncError } from "../middleware/catchAysncError.js";
import {ErrorHandler} from "../middleware/error.js"
import { sendToken } from "../utils/jwtToken.js";
import User from "../model/user.js"

export const register =catchAysncError(async(req,res,next)=>{
    const{name,email,phone,role,password}=req.body
    if(!name || !email || !phone || !role || !password){
        return next(new ErrorHandler("please fil full registration form!"))
    }

    const isEmail = await User.findOne({email})
    if(isEmail){
        return next(new ErrorHandler("email  already exist!"))
    }
    const user = await User.create({
        name,
        email,
        phone,
        role,
        password,
    })
    sendToken(user,200,res,"user registered successfully")
})

// login
export const login =catchAysncError(async(req,res,next)=>{
    const {email ,password,role}=req.body
    if(!email || !password || !role){
        return next(
            new ErrorHandler("please provise email,password and role",400)
        )
    }
    const user = await User.findOne({email}).select("+password")
        if(!user){ 
            return next(new ErrorHandler("invalid email and password",400) )       
        }
        const ispasswordMatched = await user.comparePassword(password)
        if(!ispasswordMatched){ 
             return next( new ErrorHandler("invalid email and password",400) )       
        }
        if(user.role !==role){
          return next(new ErrorHandler("user with this role is not found",400))
        }
        sendToken(user,200,res,"user is logged succesfully")
})

// logout
export const logout =catchAysncError(async(req,res,next)=>{
    res.status(200).cookie(
        "token","",{
            httpOnly:true,
            expires:new Date(Date.now()),
        }
    )
    .json({
        success:true,
        message:"user logout successfully",
    });
})



