import { getForm, getFormPages, getPageQuestions } from "db/query";
import { Hono } from "hono";
import { transformFormFull, transformPageFull, transformQuestion } from "utils/conversions";

type Bindings = {
    DB: D1Database;
}

const forms = new Hono<{ Bindings: Bindings }>();

forms.get(':uuid', async c => {
    const formUUID = c.req.param('uuid');

    const form = await getForm(formUUID);

    if (!form) {
        return c.notFound();
    }

    const pages = await getFormPages(form.id);
    const fullPages = await Promise.all(pages.map(async p => {
        const questions = await getPageQuestions(p.id);
        const safeQuestions = questions.map(q => transformQuestion(q));

        const fullPage = transformPageFull(p);
        fullPage.questions = safeQuestions;
        return fullPage;
    }));

    const fullForm = transformFormFull(form);
    fullForm.pages = fullPages;
    
    return c.json(fullForm);
});

export default forms;


