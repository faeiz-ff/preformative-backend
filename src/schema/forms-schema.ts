import { zValidator } from "@hono/zod-validator";
import z from "zod";

const questionSchema = z.object({
    prompt: z.string(),
    type: z.enum(["text", "textarea", "singlechoice", "checkbox"]),
    config: z.string(),
    questionIndex: z.number()
});

const pageSchema = z.object({
    description: z.string(),
    type: z.enum(["branch", "basic", "submit"]),
    pageIndex: z.number(),
});

const formSchema = z.object({
    title: z.string("Form title expected"),
    description: z.string("Form description expected"),
});

export type FormSchema = z.infer<typeof formSchema>;
export type PageSchema = z.infer<typeof pageSchema>;
export type QuestionSchema = z.infer<typeof questionSchema>;

const formsValidator = zValidator('json', formSchema, (result, c) => {
    if (!result.success) {
        return c.json({
            errors: result.error.issues.map(issue => issue.message)
        }, 400);
    }
});

export default formsValidator;
