import { Hono } from "hono";
import forms from "./routes/forms";
import users from "./routes/users";


const app = new Hono();

app.route('/', forms);
app.route('/', users);

app.get('/', c => {
    return c.text("Hello world");
});


app.get('*', c => {
    return c.notFound();
})


export default app;
