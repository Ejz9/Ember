import * as z from "zod";


export const ComplexitySchema = z.object({
    "Name": z.string(),
    "Bytes": z.number(),
    "CodeBytes": z.number(),
    "Code": z.number(),
    "Comment": z.number(),
    "Blank": z.number(),
    "Complexity": z.number(),
    "Count": z.number(),
    "WeightedComplexity": z.number(),
    "Files": z.array(z.any()),
    "LineLength": z.null(),
    "ULOC": z.number(),
});
export type Complexity = z.infer<typeof ComplexitySchema>;

// made with https://app.quicktype.io/