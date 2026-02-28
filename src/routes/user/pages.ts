import { getFormPage, getFormPages } from "db/query";
import { Hono } from "hono";
import { DBForm } from "types/db";
import { transformPageSafe } from "utils/conversions";
import questionsRoute from "./questions";

type Bindings = {
    DB: D1Database;
}

type Variables = {
    form: DBForm;
}

const pages = new Hono<{ Bindings: Bindings, Variables: Variables }>();

pages.get('/', async c => {
    const form = c.get('form');

    const pages = await getFormPages(form.id);
    const safePages =  pages.map(p => transformPageSafe(p));

    return c.json(safePages);
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

pages.route('/:pageIndex/questions', questionsRoute);

export default pages;
