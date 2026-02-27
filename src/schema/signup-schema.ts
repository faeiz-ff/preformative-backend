import { zValidator } from '@hono/zod-validator'
import z from 'zod'

const signupSchema = z.object({
    username: z.string(),
    password: z
        .string()
        .min(8, { message: 'Password must be atleast 8 characters long' })
});

const signupValidator = zValidator('json', signupSchema, (result, c) => {
    if (!result.success) {
        return c.json({
            errors: result.error.issues.map(issue => issue.message)
        }, 400);
    }
});

export default signupValidator;
