import { zValidator } from "@hono/zod-validator";
import z from "zod";

const questionSchemaBase = z.object({
    name: z.string('Question name expected'),
    isRequired: z.boolean('Question isRequired expected'),
    prompt: z.string('Question prompt expected')
});

const questionText = z.object({
    type: z.literal('text'),
    isNumberOnly: z.boolean()
}).and(questionSchemaBase);

const questionTextArea = z.object({
    type: z.literal('textarea'),
}).and(questionSchemaBase);

const questionCheckBox = z.object({
    type: z.literal('checkbox'),
    choices: z.array(z.string()),
    minimumOf: z.number(),
}).and(questionSchemaBase);

const questionSingleChoice = z.object({
    type: z.literal('singlechoice'),
    choices: z.array(z.string()),
}).and(questionSchemaBase);

export const questionSchema = z.union([questionText, questionTextArea, questionCheckBox, questionSingleChoice]);

export type QuestionSchema = z.infer<typeof questionSchema>;

const questionValidator = zValidator('json', questionSchema, (result, c) => {
    if (!result.success) {
        return c.json({
            errors: result.error.issues.map(issue => issue.message)
        }, 400);
    }
});

export default questionValidator;
