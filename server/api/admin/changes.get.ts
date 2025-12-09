import {AuditLog} from "~~/server/models/audit-log";

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers,
    });

    if (!session) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        });
    }

    const query = getQuery(event);
    const page = Number(query.page);
    const limit = Number(query.limit);
    const skip = (page - 1) * limit;

    return AuditLog.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit)
        .select('snippetId userId email action createdAt')
        .lean();
})