import { Snippet } from "~~/server/models/snippet";
export default defineEventHandler(async (event) => {
    const snippetId = getRouterParam(event, 'id');

    const session = await auth.api.getSession({
        headers: event.headers,
    });

    const snippet = await Snippet.findOne({
        _id: snippetId
    });

    if (!snippet) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Snippet not found',
        });
    }

    if (snippet.isPublic) {
        return snippet;
    }

    if (session && session.user.id === snippet.userId) {
        return snippet;
    }

    throw createError({
        statusCode: 403,
        statusMessage: 'Access Denied',
    });
});