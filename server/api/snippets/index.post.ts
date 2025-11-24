import { Snippet } from '~~/server/models/snippet'

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers,
    });

    if (!session || !session.user.id) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized: You must be logged in to create a snippet.',
        })
    }

    const body = await readBody(event);
    const snippetData = new Snippet({
        ...body,
        userId: session.user.id,
        author: session.user.username,
        version: "1.0.0"
    });

    await snippetData.save();

    console.log('Snippet saved successfully')

    return snippetData;
});
