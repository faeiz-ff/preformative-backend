import { zValidator } from "@hono/zod-validator";
import z from "zod";

const formSchema = z.object({
    title: z.string("Form title expected"),
    description: z.string("Form description expected"),
});

export type FormSchema = z.infer<typeof formSchema>;

const formsValidator = zValidator('json', formSchema, (result, c) => {
    if (!result.success) {
        return c.json({
            errors: result.error.issues.map(issue => issue.message)
        }, 400);
    }
});

export default formsValidator;
