import { env } from "cloudflare:workers";
import { Hono } from "hono";
import { jwt, verify } from "hono/jwt";
import { SignatureKey } from "hono/utils/jwt/jws";
import { getUserFromID } from "db/query";
import { DBForm } from "types/db";
import formsRoute from "routes/user/forms";
import { getCookie } from "hono/cookie";

type Bindings = {
    DB: D1Database;
    JWT_TOKEN_SECRET: SignatureKey;
}

type Variables = {
    form: DBForm;
}

const user = new Hono<{ Bindings: Bindings, Variables: Variables }>();

user.use('*',async (c, next) => {
    const token = getCookie(c, 'authToken')

    if (!token) {
        return c.json({ error: 'Unauthorized' }, 401)
    }

    try {
        const payload = await verify(token, c.env.JWT_TOKEN_SECRET, { alg:'HS256'});

        c.set('jwtPayload', payload);

        await next()
    } catch {
        return c.json({ error: 'Invalid token' }, 401)
    }
} );

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
