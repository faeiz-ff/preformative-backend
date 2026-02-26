import { Hono } from "hono";

type Bindings = {
    DB: D1Database;
}

const forms = new Hono<{ Bindings: Bindings }>().basePath('forms');

forms.get('/', async c => {
    const { results } = await c.env.DB.prepare(
        'SELECT * FROM Form'
    ).all();

    return c.json(results);
})

forms.get(':id', async c => {
    const formID = c.req.param('id');

    const form = await c.env.DB.prepare(
        'SELECT * FROM Form WHERE id = ?'
    ).bind(formID).first();

    if (form) {
        return c.json(form);
    } else {
        return c.notFound();
    }
})

export default forms;


