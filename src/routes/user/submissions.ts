import { getFormSubmissions } from "db/query";
import { Hono } from "hono";
import { DBForm } from "types/db";
import { transformSubmission } from "utils/conversions";


type Bindings = {
    DB: D1Database;
}

type Variables = {
    form: DBForm;
}

const submissions = new Hono<{ Bindings: Bindings, Variables: Variables }>();

submissions.get('/', async (c) =>{
    const form = c.get('form');

    const submissions = await getFormSubmissions(form.id);
    const safeSubmissions = submissions.map(transformSubmission);
    
    return c.json(safeSubmissions);
});

export default submissions;

