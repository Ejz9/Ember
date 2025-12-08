import {Snippet} from "~~/server/models/snippet";
import {User} from "~~/server/models/user";

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
    let range = query.range;
    const period = query.period;

    if (typeof range === 'string') {
        try { range = JSON.parse(range) } catch (e) {}
    }

    if (!range || !range.start || !range.end || !period) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Date range (start/end) and period are required for stats'
        })
    }

    const currentStart = new Date(range.start);
    const currentEnd = new Date(range.end);

    const duration = currentEnd.getTime() - currentStart.getTime();
    const prevEnd = new Date(currentStart.getTime());
    const prevStart = new Date(prevEnd.getTime() - duration);

    const getMetrics = async (start: Date, end: Date) => {
        const dateFilter = { createdAt: { $gte: start, $lte: end } };

        const [userCount, snippetCount, maxComplexity, fragmentAggregate] = await Promise.all([
            User.countDocuments(dateFilter),
            Snippet.countDocuments(dateFilter),
            Snippet.findOne(dateFilter).sort({ estimatedComplexity: -1 }).select('estimatedComplexity'),
            Snippet.aggregate([
                { $match: dateFilter },
                { $group: { _id: null, total: { $sum: { $size: '$fragments' } } } }
            ])
        ]);

        return {
            userCount: userCount,
            snippetCount: snippetCount,
            maxComplexity: maxComplexity?.estimatedComplexity || 0,
            fragmentAggregate: fragmentAggregate[0]?.total || 0
        };
    };

    const [current, previous] = await Promise.all([getMetrics(currentStart, currentEnd), getMetrics(prevStart, prevEnd)]);

    const calcVariance = (curr: number, prev: number | undefined) => {
        if (prev === undefined) return 0;
        if (prev === 0) return curr > 0 ? 100 : 0;

        const percentageChange = ((curr - prev) / prev) * 100;
        return Math.round(percentageChange);
    }

    return [
        {
            title: 'Users',
            value: current.userCount,
            icon: 'i-lucide-users',
            variation: calcVariance(current.userCount, previous.userCount)
        },
        {
            title: 'Snippets',
            value: current.snippetCount,
            icon: 'i-lucide-code',
            variation: calcVariance(current.snippetCount, previous.snippetCount)
        },
        {
            title: 'Fragments',
            value: current.fragmentAggregate,
            icon: 'i-lucide:puzzle',
            variation: calcVariance(current.fragmentAggregate, previous.fragmentAggregate)
        },
        {
            title: 'Max Complexity',
            value: current.maxComplexity,
            icon: 'i-lucide-clock',
            variation: calcVariance(current.maxComplexity, previous.maxComplexity)
        }
    ]
});