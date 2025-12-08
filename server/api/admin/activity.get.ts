import { Snippet } from '~~/server/models/snippet'

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers
    })

    if (!session) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }

    const query = getQuery(event);
    const timezone = (query.timezone as string) || 'UTC';
    let range = query.range;
    if (typeof range === 'string') {
        try { range = JSON.parse(range); } catch (e) {}
    }
    const period = query.period as 'daily' | 'weekly' | 'monthly';

    if (!range || !range.start || !range.end || !period) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Date range (start/end) and period are required for activity'
        })
    }

    const start = new Date(range.start);
    const end = new Date(range.end);

    const dateFilter = {
        createdAt: {
            $gte: start,
            $lte: end
        }
    }

    let groupByFormat: string;
    switch (period) {
        case "weekly":
            groupByFormat = "%G-%V";
            break;
        case "monthly":
            groupByFormat = "%Y-%m";
            break;
        default:
            groupByFormat = "%Y-%m-%d";
            break;
    }

    const rawStats = await Snippet.aggregate([
        { $match: dateFilter },
        { $group: {
                _id: {
                    $dateToString: {
                        format: groupByFormat,
                        date: "$createdAt",
                        timezone: timezone
                    },
                },
                amount: { $sum: 1 },
            }},
        {
            $project: {
                _id: 0,
                date: "$_id",
                amount: 1
            },
        },
        {
            $sort: { date: 1 },
        },
    ])
    return fillDataGaps(rawStats, start, end, period, timezone);
})
