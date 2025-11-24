import { Snippet } from '~~/server/models/snippet'
import { auth } from '~~/server/utils/auth'
import {calculateComplexity} from "~~/server/utils/complexity";

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

    const updateData = {...body};
    if (body.fragments) {
        updateData.complexity = await calculateComplexity(body.fragments);
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
        complexity: updateData.complexity
    };
});