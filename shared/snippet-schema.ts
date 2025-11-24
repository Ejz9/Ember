import * as z from "zod";


export const AtedAtSchema = z.object({
    "$date": z.coerce.date(),
});
export type AtedAt = z.infer<typeof AtedAtSchema>;

export const IdSchema = z.object({
    "$oid": z.string(),
});
export type Id = z.infer<typeof IdSchema>;

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

export const FragmentSchema = z.object({
    "label": z.string(),
    "language": z.string(),
    "code": z.string(),
    "_id": IdSchema,
});
export type Fragment = z.infer<typeof FragmentSchema>;

export const SnippetSchema = z.object({
    "_id": IdSchema,
    "userId": z.string(),
    "isPublic": z.boolean(),
    "title": z.string(),
    "description": z.string(),
    "tags": z.array(z.any()),
    "relatedLinks": z.array(z.any()),
    "complexity": z.number(),
    "sccStats": z.array(ComplexitySchema),
    "fragments": z.array(FragmentSchema),
    "createdAt": AtedAtSchema,
    "updatedAt": AtedAtSchema,
    "__v": z.number(),
    "author": z.string(),
});
export type Snippet = z.infer<typeof SnippetSchema>;
// made with https://app.quicktype.io/