import { Hono } from "hono";
import { SignatureKey } from "hono/utils/jwt/jws";

type Bindings = {
    DB: D1Database;
    JWT_TOKEN_SECRET: SignatureKey
}

const debug = new Hono<{ Bindings: Bindings }>();

debug.get('/users', async c => {
    const { results } = await c.env.DB.prepare('SELECT * FROM users').all();
    return c.json({ results });
});

debug.get('/forms', async c => {
    const { results } = await c.env.DB.prepare('SELECT * FROM forms').all();
    return c.json({ results });
});

debug.get('/pages', async c => {
    const { results } = await c.env.DB.prepare('SELECT * FROM pages').all();
    return c.json({ results });
});

debug.get('/questions', async c => {
    const { results } = await c.env.DB.prepare('SELECT * FROM questions').all();
    return c.json({ results });
});

debug.get('/submissions', async c => {
    const { results } = await c.env.DB.prepare('SELECT * FROM submissions').all();
    return c.json({ results });
});

debug.get('/answers', async c => {
    const { results } = await c.env.DB.prepare('SELECT * FROM answers').all();
    return c.json({ results });
});

export default debug;
