import { Hono } from "hono";

type Bindings = {
    DB: D1Database;
}

const forms = new Hono<{ Bindings: Bindings }>();

forms.get(':uuid', async c => {
    const formUUID = c.req.param('uuid');

    const form = await c.env.DB.prepare(
        'SELECT * FROM forms WHERE public_id = ?'
    ).bind(formUUID).first();

    if (form) {
        return c.json(form);
    } else {
        return c.notFound();
    }
});

export default forms;


