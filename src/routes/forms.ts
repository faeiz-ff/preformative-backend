import { Hono } from "hono";

type Bindings = {
    DB: D1Database;
}

const forms = new Hono<{ Bindings: Bindings }>().basePath('forms');

forms.get(':id', async c => {
    const formID = c.req.param('id');

    const form = await c.env.DB.prepare(
        'SELECT * FROM forms WHERE public_id = ?'
    ).bind(formID).first();

    if (form) {
        return c.json(form);
    } else {
        return c.notFound();
    }
});

export default forms;


