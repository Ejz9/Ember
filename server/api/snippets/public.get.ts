import { Snippet } from '~~/server/models/snippet'

export default defineEventHandler(async (event) => {
    return Snippet.find({isPublic: true}).sort({updatedAt: -1});
});