import { deleteForm, getForm, getUserForms, insertForm, setFormIsPublic } from "db/query";
import { Hono } from "hono";
import { DBForm } from "types/db";
import { transformFormSafe } from "utils/conversions";
import pagesRoute from "./pages";
import formsValidator from "schema/forms-schema";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import submissionsRoute from "./submissions";

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
    return c.json(userForms.map(transformFormSafe));
});

forms.post('/', formsValidator, async c => {
    const { sub: userID } = c.get('jwtPayload');
    const formInput = c.req.valid('json');

    try {
        const uuid = await insertForm(userID, formInput);
        return c.json({ message: "Form created", uuid: uuid }, 201);
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message);
        }
        return c.json({ errors: ["Internal server error"] }, 500);
    }
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

forms.put('/:uuid', formsValidator, async c => {
    const { sub: userID } = c.get('jwtPayload');
    const form = c.get('form');
    const newForm = c.req.valid('json');

    try {
        const uuid = form.public_id;
        deleteForm(form.id);
        insertForm(userID, newForm, uuid);

        return c.json({ message: "Form replaced" }, 200);
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message);
        }
        return c.json({ errors: ["Internal server error"] }, 500);
    }
});

forms.delete('/:uuid', async c => {
    const form = c.get('form');
    try {
        await deleteForm(form.id);
        return c.json({ message: "Form deleted" }, 200);
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message);
        }
        return c.json({ errors: ["Internal server error"] }, 500);
    }
});

forms.post('/:uuid/publish', 
    zValidator('json', z.object({ isPublish: z.boolean() }), (result, c) => {
        if (!result.success) {
            return c.json({
                errors: result.error.issues.map(issue => issue.message)
            }, 400);
        }
    }), 
    async c => {
        const form = c.get('form');
        const { isPublish } = c.req.valid('json');
        try {
            setFormIsPublic(form.id, isPublish);
            return c.json({
                message: "Form is now " + (isPublish) ? "published" : "private"
            }, 200);
        } catch (e) {
            if (e instanceof Error) {
                console.log(e.message);
            }
            return c.json({ errors: ["Internal server error"] }, 500);
        }
});

forms.route('/:uuid/pages', pagesRoute);
forms.route('/:uuid/submissions', submissionsRoute);

export default forms;
