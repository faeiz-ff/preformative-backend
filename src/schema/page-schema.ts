import { zValidator } from "@hono/zod-validator";
import z from "zod";

const pageSchemaBase = z.object({
    description: z.string(),
})

const pageBranch = z.object({
    type: z.literal('branch'),
    condition: z.object({
        name: z.string(),
        expectedValue: z.string(),
        thenPage: z.number(),
        elsePage: z.number()
    })
}).and(pageSchemaBase);

const pageBasic = z.object({
    type: z.literal('basic'),
    next: z.number()
}).and(pageSchemaBase);

const pageSubmit = z.object({
    type: z.literal('submit')
}).and(pageSchemaBase);

const pageSchema = pageBranch.or(pageBasic).or(pageSubmit);

export type PageSchema = z.infer<typeof pageSchema>;

const pageValidator = zValidator('json', pageSchema, (result, c) => {
    if (!result.success) {
        return c.json({
            errors: result.error.issues.map(issue => issue.message)
        }, 400);
    }
});

export default pageValidator;

