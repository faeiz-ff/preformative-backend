import { zValidator } from '@hono/zod-validator'
import z from 'zod'

const alphanumericRegex = /^[a-zA-Z0-9]+$/;

const alphanumericString = z.string().regex(alphanumericRegex, {
    message: "Username must contain only letters and numbers",
});

const signupSchema = z.object({
    username: alphanumericString,
    password: z
        .string()
        .min(8, { message: 'Password must be atleast 8 characters long' })
});

const signupValidator = zValidator('json', signupSchema, async (result, c) => {
    if (!result.success) {
        return c.json({
            whatYouSent: result.data,
            errors: result.error.issues.map(issue => issue.message)
        }, 400);
    }
});

export default signupValidator;
