import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

}, { timestamps: true, strict: false,  collection: 'user' });

export const User = mongoose.models.user || mongoose.model('user', userSchema);