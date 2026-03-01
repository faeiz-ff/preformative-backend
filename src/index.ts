import { Hono } from "hono";
import formsRoute from "./routes/forms";
import userRoute from "./routes/user/index";
import authRoute from "./routes/auth";
import { cors } from "hono/cors";

// // TODO: Delete this in prod
// import debugRoute from "./routes/debug";

const app = new Hono();

app.use("*", cors({
    origin: "*",
    credentials: true,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// app.route('/debug', debugRoute);
app.route('/forms', formsRoute);
app.route('/user', userRoute);
app.route('/auth', authRoute);

app.get('*', c => {
    return c.notFound();
})


export default app;
