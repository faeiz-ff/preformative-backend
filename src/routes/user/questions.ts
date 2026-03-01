import { getPageQuestion, getPageQuestions, insertQuestion } from "db/query";
import { Hono } from "hono";
import questionValidator from "schema/question-schema";
import { DBForm, DBPage } from "types/db";
import { transformQuestion } from "utils/conversions";

type Bindings = {
    DB: D1Database;
}

type Variables = {
    form: DBForm;
    page: DBPage;
}

const questions = new Hono<{ Bindings: Bindings, Variables: Variables }>();

questions.get('/', async c => {
    const page = c.get('page')

    const questions = await getPageQuestions(page.id);
    const safeQuestions = questions.map(transformQuestion);

    return c.json(safeQuestions);
});

questions.post('/', questionValidator, async c => {
    const page = c.get('page');
    const question = c.req.valid('json');

    const pageQuestions = await getPageQuestions(page.id);
    const index = pageQuestions.length + 1;

    try {
        await insertQuestion(page.id, question, index);
        return c.json({ message: `Question inserted into index ${index}` }, 201);
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message);
        }
        return c.json({ errors: ["Internal server error"] }, 500);
    }
});

questions.get('/:questionIndex', async (c) => {
    const page = c.get('page');

    const questionIndex = Number(c.req.param('questionIndex'));
    const question = await getPageQuestion(page.id, questionIndex);

    if (!question) {
        return c.notFound();
    }

    return c.json(transformQuestion(question));
});

export default questions;
