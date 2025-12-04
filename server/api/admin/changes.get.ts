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

    // Fetch the last 5 audit log entries
    return AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('snippetId userId email action createdAt -_id')
      .lean();
})