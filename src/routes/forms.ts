import { getForm, getFormPages, getPageQuestions, makeSubmission } from "db/query";
import { Hono } from "hono";
import { submissionValidator } from "schema/submission-schema";
import { DBForm } from "types/db";
import { transformFormFull, transformPageFull, transformQuestion } from "utils/conversions";

type Bindings = {
    DB: D1Database;
}

type Variables = {
    form: DBForm;
}

const forms = new Hono<{ Bindings: Bindings, Variables: Variables }>();

forms.use('/:uuid', async (c, next) => {
    const formUUID = c.req.param('uuid');

    const form = await getForm(formUUID);

    if (!form) {
        return c.notFound();
    }

    if (!form.is_public) {
        return c.json({ message: "Form is not public" }, 403);
    }

    c.set('form', form);
    await next();
})

forms.get('/:uuid', async (c) => {
    const form = c.get('form');
    const pages = await getFormPages(form.id);

    const fullPages = await Promise.all(pages.map(async p => {
        const questions = await getPageQuestions(p.id);
        const safeQuestions = questions.map(transformQuestion);

        const fullPage = transformPageFull(p);
        fullPage.questions = safeQuestions;
        return fullPage;
    }));

    const fullForm = transformFormFull(form);
    fullForm.pages = fullPages;

    return c.json(fullForm);
});

forms.post('/:uuid', submissionValidator, async (c) => {
    const form = c.get('form');
    const submission = c.req.valid('json');

    try {
        await makeSubmission(form.id, submission);
        return c.json({ message: "Submitted" }, 200);
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message);
        }
        return c.json({ errors: ["Internal server error"] }, 500);
    }
});

export default forms;


