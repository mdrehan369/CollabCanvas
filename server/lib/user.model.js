import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
});

export const userModel = new mongoose.model("user", userSchema);
