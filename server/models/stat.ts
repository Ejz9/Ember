import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
    users: { type: Number, default: 0 },
    snippets: { type: Number, default: 0 },
    fragments: { type: Number, default: 0 },
    maxComplexity: { type: Number, default: 0 }
}, { timestamps: true });

export const Stat = mongoose.model('stats', statsSchema);