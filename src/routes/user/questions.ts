import { getFormPage, getPageQuestion, getPageQuestions } from "db/query";
import { Hono } from "hono";
import { DBForm } from "types/db";
import { transformQuestionSafe } from "utils/conversions";

type Bindings = {
    DB: D1Database;
}

type Variables = {
    form: DBForm;
}

const questions = new Hono<{ Bindings: Bindings, Variables: Variables }>();

questions.get('/', async c => {
    const form = c.get('form');

    const pageIndex = Number(c.req.param('pageIndex'));
    const page = await getFormPage(form.id, pageIndex);

    if (!page) {
        return c.notFound();
    }

    const questions = await getPageQuestions(page.id);
    const safeQuestions = questions.map(q => transformQuestionSafe(q));

    return c.json(safeQuestions);
});

questions.get('/:questionIndex', async (c) => {
    const form = c.get('form');
    
    const pageIndex = Number(c.req.param('pageIndex'));
    const questionIndex = Number(c.req.param('questionIndex'));
    const page = await getFormPage(form.id, pageIndex);

    if (!page) {
        return c.notFound();
    }

    const question = await getPageQuestion(page.id, questionIndex);

    if (!question) {
        return c.notFound();
    }

    return c.json(transformQuestionSafe(question));
});

export default questions;
