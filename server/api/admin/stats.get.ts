import {Snippet} from "~~/server/models/snippet";
import {Stat} from "~~/server/models/stat";
import {User} from "~~/server/models/user";
import {subDays} from "date-fns";

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

    const [userCount, snippetCount, maxComplexity, fragmentAggregate] = await Promise.all([
        User.countDocuments(),
        Snippet.countDocuments(),
        Snippet.findOne().sort({ estimatedComplexity: -1 }).select('estimatedComplexity'),
        Snippet.aggregate([{ $group: { _id: null, total: { $sum: { $size: '$fragments' } } } }])
    ])

    const currentFragments = fragmentAggregate[0]?.total || 0
    const maxComplexityValue = maxComplexity?.estimatedComplexity || 0

    const yesterday = subDays(new Date(), 1)
    const snapshot = await Stat.findOne({ date: { $lte: yesterday } }).sort({ date: -1})

    const calcVariance = (curr: number, prev: number | undefined) => {
        if (!prev) return 0;
        return Math.abs(curr - prev) / prev * 100;
    }

    return [
        {
            title: 'Users',
            value: userCount,
            icon: 'i-lucide-users',
            variation: calcVariance(userCount, snapshot?.users)
        },
        {
            title: 'Snippets',
            value: snippetCount,
            icon: 'i-lucide-code',
            variation: calcVariance(snippetCount, snapshot?.snippets)
        },
        {
            title: 'Fragments',
            value: currentFragments,
            icon: 'i-lucide-code-slash',
            variation: calcVariance(currentFragments, snapshot?.fragments)
        },
        {
            title: 'Max Complexity',
            value: maxComplexityValue,
            icon: 'i-lucide-clock',
            variation: calcVariance(maxComplexityValue, snapshot?.maxComplexity)
        }
    ]
});