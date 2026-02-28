import { env } from "cloudflare:workers";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { SignatureKey } from "hono/utils/jwt/jws";
import { getUserFromID } from "db/query";
import { DBForm } from "types/db";
import formsRoute from "routes/user/forms";

type Bindings = {
    DB: D1Database;
    JWT_TOKEN_SECRET: SignatureKey;
}

type Variables = {
    form: DBForm;
}

const user = new Hono<{ Bindings: Bindings, Variables: Variables }>();

user.use('*', jwt({ secret: env.JWT_TOKEN_SECRET, alg: 'HS256' }));

user.get('/', async c => {
    const { sub: userID } = c.get('jwtPayload');
    const userInfo = await getUserFromID(userID);
    if (!userInfo) {
        return c.json({ errors: ["Internal server error"] }, 500);
    } else {
        return c.json({
            username: userInfo.username
        });
    }
});

user.route('/forms', formsRoute);

export default user;
