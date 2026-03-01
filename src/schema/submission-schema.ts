import { zValidator } from "@hono/zod-validator";
import z from "zod";


const answerSchema = z.object({
    questionIndex: z.number(),
    pageIndex: z.number(),
    value: z.string()
});

const submissionSchema = z.object({
    answers: z.array(answerSchema)
});

export type AnswerSchema = z.infer<typeof answerSchema>;
export type SubmissionSchema = z.infer<typeof submissionSchema>;

export const submissionValidator = zValidator('json', submissionSchema, (result, c) => {
    if (!result.success) {
        return c.json({
            errors: result.error.issues.map(issue => issue.message)
        }, 400);
    }
});

