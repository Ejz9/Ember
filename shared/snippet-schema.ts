import * as z from "zod";


export const AtedAtSchema = z.object({
    "$date": z.coerce.date(),
});
export type AtedAt = z.infer<typeof AtedAtSchema>;

export const IdSchema = z.object({
    "$oid": z.string(),
});
export type Id = z.infer<typeof IdSchema>;

export const ComplexityElementSchema = z.object({
    "Language": z.string(),
    "PossibleLanguages": z.array(z.string()),
    "Filename": z.string(),
    "Extension": z.string(),
    "Location": z.string(),
    "Symlocation": z.string(),
    "Bytes": z.number(),
    "Lines": z.number(),
    "Code": z.number(),
    "Comment": z.number(),
    "Blank": z.number(),
    "Complexity": z.number(),
    "WeightedComplexity": z.number(),
    "Hash": z.null(),
    "Binary": z.boolean(),
    "Minified": z.boolean(),
    "Generated": z.boolean(),
    "EndPoint": z.number(),
    "Uloc": z.number(),
    "Label": z.string(),
});
export type ComplexityElement = z.infer<typeof ComplexityElementSchema>;

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
    "sccStats": z.array(ComplexityElementSchema),
    "fragments": z.array(FragmentSchema),
    "createdAt": AtedAtSchema,
    "updatedAt": AtedAtSchema,
    "__v": z.number(),
    "author": z.string(),
});
export type Snippet = z.infer<typeof SnippetSchema>;
// made with https://app.quicktype.io/