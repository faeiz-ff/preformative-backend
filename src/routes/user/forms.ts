import { getForm, getUserForms } from "db/query";
import { Hono } from "hono";
import { DBForm } from "types/db";
import { transformFormSafe } from "utils/conversions";
import pagesRoute from "./pages";

type Bindings = {
    DB: D1Database;
}

type Variables = {
    form: DBForm;
}

const forms = new Hono<{ Bindings: Bindings, Variables: Variables }>();

forms.get('/', async c => {
    const { sub: userID } = c.get('jwtPayload');
    const userForms = await getUserForms(userID);
    return c.json(userForms.map(f => transformFormSafe(f)));
});

// validate if form is owned by user
forms.use('/:uuid/*', async (c, next) => {
    const { sub: userID } = c.get('jwtPayload');
    const formUUID = c.req.param('uuid');
    const form = await getForm(formUUID);

    if (!form) {
        return c.notFound();
    } else if (form.user_id !== userID) {
        console.log(form);
        console.log(userID, form.user_id);
        return c.json({ errors: ["Forbidden"] }, 403);
    }

    c.set('form', form);
    await next();
});
    
forms.get('/:uuid', async c => {
    const form = c.get('form');
    return c.json(transformFormSafe(form));
});

forms.route('/:uuid/pages', pagesRoute);

export default forms;
