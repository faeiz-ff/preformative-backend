import { getFormPage, getFormPages, insertPage } from "db/query";
import { Hono } from "hono";
import { DBForm, DBPage } from "types/db";
import { transformPageSafe } from "utils/conversions";
import questionsRoute from "./questions";
import pageValidator from "schema/page-schema";

type Bindings = {
    DB: D1Database;
}

type Variables = {
    form: DBForm;
    page: DBPage;
}

const pages = new Hono<{ Bindings: Bindings, Variables: Variables }>();

pages.get('/', async c => {
    const form = c.get('form');

    const pages = await getFormPages(form.id);
    const safePages =  pages.map(p => transformPageSafe(p));

    return c.json(safePages);
});

pages.post('/', pageValidator, async c => {
    const form = c.get('form');
    const page = c.req.valid('json');

    const formPages = await getFormPages(form.id);
    const index = formPages.length + 1;

    try {
        await insertPage(form.id, page, index);
        return c.json({ message: `Page inserted into index ${index}`}, 201);
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message);
        }
        return c.json({ errors: ["Internal server error"] }, 500);
    }
});

pages.get('/:pageIndex', async c => {
    const form = c.get('form');

    const pageIndex = Number(c.req.param('pageIndex'));
    const page = await getFormPage(form.id, pageIndex);

    if (!page) {
        return c.notFound();
    }

    return c.json(transformPageSafe(page));
});

pages.use('/:pageIndex/*', async (c, next) => {
    const form = c.get('form');
    
    const pageIndex = Number(c.req.param('pageIndex'));
    const page = await getFormPage(form.id, pageIndex);

    if (!page) {
        return c.notFound();
    }

    c.set('page', page);
    await next();
})

pages.route('/:pageIndex/questions', questionsRoute);

export default pages;
