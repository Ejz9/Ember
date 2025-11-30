import { Cron } from 'croner';
import {Stat} from "~~/server/models/stat";
import {User} from "~~/server/models/user";
import {Snippet} from "~~/server/models/snippet";

export default defineNitroPlugin((nitroApp) => {
    new Cron('0 0 * * *', async () => {
        console.log('Running Stats Snapshot...');

        try {
            const today = new Date().toISOString().split('T')[0];
            const exists = await Stat.exists( { modifiedAt: today });
            if (exists) return;

            const [
                userCount,
                snippetCount,
                totalComplexity,
                fragmentAggregate
            ] = await Promise.all([
                User.countDocuments(),
                Snippet.countDocuments(),
                Snippet.findOne().sort({ estimatedComplexity: -1 }).select('estimatedComplexity'),
                Snippet.aggregate([{
                        $group: { _id: null, total: { $sum: { $size: '$fragments' } } }
                    }])
            ]);

            const totalFragments = fragmentAggregate[0]?.total || 0;
            const maxComplexity = totalComplexity?.estimatedComplexity || 0;

            await Stat.create({
                users: userCount,
                snippets: snippetCount,
                fragments: totalFragments,
                maxComplexity: maxComplexity
            })

            console.log('Stats saved successfully');
        } catch (error) {
            console.error('Failed to save stats', error);
        }
    });
});