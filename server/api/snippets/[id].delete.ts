import { Snippet } from "~~/server/models/snippet";
import { auth } from "~~/server/utils/auth";
import {AuditLog} from "~~/server/models/audit-log";

export default defineEventHandler(async (event) => {
    const snippetId = getRouterParam(event, 'id');

    const session = await auth.api.getSession({
        headers: event.headers,
    });

    if (!session) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        });
    }

    const snippet = await Snippet.findOne({
        _id: snippetId
    });

    if (!snippet) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Snippet not found',
        });
    }

    if (session.user.id !== snippet.userId) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Access Denied',
        });
    }

    await Snippet.deleteOne({ _id: snippetId });
    await AuditLog.create({
        action: 'deleted',
        snippetId: snippetId,
        userId: session.user.id,
        email: session.user.email
    });

    return {
        statusCode: 200,
        statusMessage: 'Snippet deleted successfully',
    };
});