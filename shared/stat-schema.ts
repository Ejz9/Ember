import * as z from "zod";


export const StatElementSchema = z.object({
    "title": z.string(),
    "value": z.number(),
    "icon": z.string(),
    "variation": z.number(),
});
export type StatElement = z.infer<typeof StatElementSchema>;
