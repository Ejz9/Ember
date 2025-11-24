import { Snippet } from '~~/server/models/snippet';

export default defineEventHandler(async (event) => {
    const requestedUserId = getRouterParam(event, 'id');

    if (!requestedUserId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'User ID not provided.',
        });
    }

    const session = await auth.api.getSession({
        headers: event.headers,
    });
    const currentUserId = session?.user?.id;

    const query: { userId: string; isPublic?: boolean } = { userId: requestedUserId };

    // If the user is not requesting their own snippets, or is not logged in, only show public snippets.
    if (currentUserId !== requestedUserId) {
        query.isPublic = true;
    }

    return Snippet.find(query).sort({ updatedAt: -1 });
});
