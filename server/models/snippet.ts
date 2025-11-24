import mongoose from  'mongoose';

const snippetSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'user',
        required: true,
        index: true
    },
    author: String,
    isPublic: Boolean,
    title: String,
    description: String,
    tags: [String],
    starred: Boolean,
    version: String,
    framework: String,
    frameworkVersion: String,
    relatedLinks: [String],
    estimatedComplexity: String,
    fragments: [
        {
            label: String,
            language: String,
            icon: String,
            code: String
        }
    ]
}, { timestamps: true });

export const Snippet = mongoose.model('Snippet', snippetSchema);