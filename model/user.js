import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please provide your name"],
        minLength: [3, "name must contain at least 3 characters"],
        maxLength: [30, "name cannot exceed 30 characters"],
    },
    email: {
        type: String,
        required: [true, "please provide your email"],
        unique: true,
        validate: [validator.isEmail, "please provide a valid email"],
    },
    phone: {
        type: String,
        required: [true, "please provide your phone number"],
        minLength: [10, "phone number must be 10 digits"],
        maxLength: [10, "phone number must be 10 digits"],
    },
    password: {
        type: String,
        required: [true, "please provide your password"],
        minLength: [8, "password must contain at least 8 characters"],
        maxLength: [32, "password cannot exceed 32 characters"],
        select: false,
    },
    role: {
        type: String,
        required: [true, "please provide your role"],
        enum: ["Job Seeker", "Employer"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

//  Hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//  Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
userSchema.methods.getJwtToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRE,
        }
    );
};

const User = mongoose.model("User", userSchema);
export default User;
