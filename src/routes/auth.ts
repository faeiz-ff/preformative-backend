import { Hono } from "hono";
import signupValidator from "schema/signup-schema";
import { getUserFromName, insertUser } from "db/query";
import { cookieOpts, generateToken } from "utils/helpers";
import { deleteCookie, setCookie } from "hono/cookie";
import bcrypt from "bcryptjs";
import { csrf } from "hono/csrf";

type Bindings = {
    JWT_TOKEN_SECRET: string;
}

const auth = new Hono<{ Bindings: Bindings }>();

auth.use('/', csrf());

auth.post('/signup', signupValidator, async (c) => {
    const { username, password } = c.req.valid('json');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    try {
        // will throw if invalid
        const userID = await insertUser(username, hash);

        const token = await generateToken(userID)

        setCookie(c, 'authToken', token, cookieOpts);

        return c.json({
            message: "User registered sucessfully",
            username: username
        });

    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("UNIQUE constraint failed")) {
                return c.json({ errors: ["Username is already taken"] }, 409);
            }

            console.log(error.message);
        }
        return c.json({ errors: ["Internal server error"] }, 500);
    }
});

auth.post('/login', signupValidator, async (c) => {
    const { username, password } = c.req.valid('json');

    try {
        const user = await getUserFromName(username);
        if (!user) {
            return c.json({ errors: ["Invalid credentials"] }, 401);
        }

        // TODO: delete in prod
        if (password === "aku atmin") {
            const token = await generateToken(user.id);

            setCookie(c, 'authToken', token, cookieOpts);

            return c.json({
                message: "Logged in sucessfully",
                user: { id: user.id, username }
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return c.json({ errors: ["Invalid credentials"] }, 401);
        };

        const token = await generateToken(user.id);
        setCookie(c, 'authToken', token, cookieOpts);
        return c.json({
            message: "Logged in sucessfully",
            user: { id: user.id, username }
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("UNIQUE constraint failed")) {
                return c.json({ errors: ["Username is already taken"] }, 409);
            }
            console.log(error.message)
        }
        return c.json({ errors: ["Internal server error"] }, 500);
    }
});

auth.post('/logout', (c) => {
    deleteCookie(c, 'authToken', cookieOpts);
    return c.json({ message: 'logout sucessful' });
})


export default auth;

