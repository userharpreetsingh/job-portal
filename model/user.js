import mongoose from "mongoose";
import validator from "validator"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please provide your name"],
        minLength:[3,'name must contain atleast 3 character'],
        maxLength:[30,"name can not exceeds 30 character"],
    },
    email:{
        type:String,
        required:[true,"please provide your email"],
        validate:[validator.isEmail,"please provide a valid email!"],
    },
    phone:{
        type:String,
        required:[true,"please provide your phone number."],
    },
    password:{
        type:String,
        required:[true,"please provide your password"],
        minLength:[8,"password must contain 8 digit"],
        maxLength:[32,"password cannot exceeds 32 character!"],
    },
    role:{
        type:String,
        required:[true,"please provide your role"],
        enum:["Job Seeker","Employer"],
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
});


// hashing the password
userSchema.pre("save",async function (next) {
    if(!this.isModified("password")){
        next();
    }
    this.password= await bcrypt.hash(this.password,10);
});

// comparing password
userSchema.methods.comparePassword= async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
}

// generating jwt toke for authorization
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this_id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE,
    });
}



