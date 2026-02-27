import { Hono } from "hono";

type Bindings = {
    DB: D1Database;
}

const users = new Hono<{ Bindings: Bindings }>().basePath('/users');

users.get('/', async c => {
    const data = await c.env.DB.prepare(
        'SELECT * FROM users'
    ).all();
    return c.json(data.results);
});

users.get('/:name', async c => {
    const searchedName = c.req.param("name");
    const result = await c.env.DB.prepare(
        'SELECT * FROM users WHERE username = ?'
    ).bind(searchedName).first();

    if (result) {
        return c.json(result);
    } else {
        return c.notFound();
    }
});

export default users;
