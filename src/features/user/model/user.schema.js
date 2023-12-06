import mongoose from "mongoose";

// Schema for Users
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        match: [/.+\@.+\../, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
});

export const UserModel = mongoose.model('User', userSchema);