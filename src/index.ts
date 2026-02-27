import { Hono } from "hono";
import forms from "./routes/forms";
import users from "./routes/users";
import api from "./routes/api";

const app = new Hono();

app.route('/', forms);
app.route('/', users);
app.route('/', api);

app.get('/', c => {
    return c.text("Hello world");
});


app.get('*', c => {
    return c.notFound();
})


export default app;
