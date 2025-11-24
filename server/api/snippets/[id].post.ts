import { Snippet } from '~~/server/models/snippet'
import { auth } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    const snippetId = getRouterParam(event, 'id');
    const body = await readBody(event);
    const session = await auth.api.getSession({
        headers: event.headers,
    });

    if (!session) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        });
    }

    await Snippet.updateOne(
        {
            _id: snippetId,
            userId: session.user.id,
        },
        {
            $set: body,
        });

    return {
        statusCode: 200,
        statusMessage: 'Snippet updated successfully',
    };
});