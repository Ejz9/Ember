import { Snippet } from '~~/server/models/snippet'
import { auth } from '~~/server/utils/auth'
import {calculateComplexity} from "~~/server/utils/complexity";
import {AuditLog} from "~~/server/models/audit-log";

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
        const { total, stats } = await calculateComplexity(body.fragments);
        updateData.estimatedComplexity = total;
        updateData.sccStats = stats;
    }

    const result = await Snippet.updateOne(
        {
            _id: snippetId,
            userId: session.user.id,
        },
        {
            $set: updateData,
        }
    );

    if (result.modifiedCount > 0) {
        await AuditLog.create({
            action: 'updated',
            snippetId,
            userId: session.user.id,
            email: session.user.email,
        });
    }

    return {
        statusCode: 200,
        statusMessage: 'Snippet updated successfully',
        estimatedComplexity: updateData.complexity,
        sccStats: updateData.sccStats,
    };
});