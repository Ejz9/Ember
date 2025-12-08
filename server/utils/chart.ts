import {
    eachDayOfInterval,
    eachWeekOfInterval,
    eachMonthOfInterval,
} from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

type StatEntry = { date: string, amount: number }

export const fillDataGaps = (
    data: StatEntry[],
    start: Date,
    end: Date,
    period: 'daily' | 'weekly' | 'monthly',
    timezone: string
): StatEntry[] => {
    const dataMap = new Map(data.map(item => [item.date, item.amount]));

    let allDates: Date[] = [];
    let formatString = '';

    switch (period) {
        case 'daily':
            allDates = eachDayOfInterval({ start, end });
            formatString = 'yyyy-MM-dd';
            break;
        case 'weekly':
            allDates = eachWeekOfInterval({ start, end }, { weekStartsOn: 0 });
            formatString = 'RRRR-II';
            break;
        case 'monthly':
            allDates = eachMonthOfInterval({ start, end });
            formatString = 'yyyy-MM';
            break;
    }

    return allDates.map(dateObj => {
        const dateKey = formatInTimeZone(dateObj, timezone, formatString);

        return {
            date: dateObj.toISOString(),
            amount: dataMap.get(dateKey) || 0,
        };
    });
}