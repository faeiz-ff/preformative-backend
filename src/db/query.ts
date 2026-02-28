import { env } from "cloudflare:workers";
import { DBForm, DBPage, DBQuestion, DBUser } from "types/db";
import { FormSchema } from "schema/forms-schema";
import { QuestionSchema } from "schema/question-schema";
import { PageSchema } from "schema/page-schema";

export const insertUser = async (username: string, password: string) => {
    const query = `INSERT INTO users (username, password) VALUES ( ?, ? ) RETURNING id;`;
    const result = await env.DB.prepare(query).bind(username, password).run<DBUser>();
    return result.results[0].id;
};

export const insertForm = async (userID: number, form: FormSchema) => {
    const uuid = crypto.randomUUID();
    await env.DB.prepare(
        `INSERT INTO forms (title, description, user_id, public_id) VALUES
            (?, ?, ?, ?);`
    ).bind(form.title, form.description, userID, uuid).run();

    return uuid;
};

export const insertQuestion = async (pageID: number, question: QuestionSchema, index: number) => {
    let config : any = {};
    switch (question.type) {
        case "text": config = { isNumberOnly: question.isNumberOnly }; break;
        case "textarea": break;
        case "checkbox": config = { choices: question.choices, minimumOf: question.minimumOf }; break;  
        case "singlechoice": config = { choices: question.choices }; break;
    }

    await env.DB.prepare(
        `INSERT INTO questions (prompt, name, page_id, is_required, type, config, question_index) VALUES
            (?, ?, ?, ?, ?, ?, ?);`
    ).bind(question.prompt, question.name, pageID, question.isRequired, question.type, JSON.stringify(config), index)
    .run();
};

export const insertPage = async (formID: number, page: PageSchema, index: number) => {
    let config : any = {};
    switch (page.type) {
        case "branch": config = { condition: page.condition }; break;
        case "basic": config = { next:page.next }; break;
        case "submit": break;
    }

    await env.DB.prepare(
        `INSERT INTO pages (description, type, form_id, page_index, config) VALUES
            (?, ?, ?, ?, ?);`
    ).bind(page.description, page.type, formID, index, JSON.stringify(config))
    .run();
}

export const getUserFromName = async (username: string) => {
    const query = `SELECT * FROM users WHERE username = ?`;
    return await env.DB.prepare(query).bind(username).first<DBUser>();
};

export const getUserFromID = async (userID: number) => {
    const query = `SELECT * FROM users WHERE id = ?`;
    return await env.DB.prepare(query).bind(userID).first<DBUser>();
};

export const getUserForms = async (userID: number) => {
    const query = `SELECT * FROM forms WHERE user_id = ? ORDER BY created_at ASC`;
    const result = await env.DB.prepare(query).bind(userID).all<DBForm>()
    return result.results;
};

export const getForm = async (formUUID: string) => {
    const query = `SELECT * FROM forms WHERE public_id = ?`;
    return await env.DB.prepare(query).bind(formUUID).first<DBForm>();
};

export const getFormPages = async (formID: number) => {
    const query = `SELECT * FROM pages WHERE form_id = ? ORDER BY page_index ASC`;
    const result = await env.DB.prepare(query).bind(formID).all<DBPage>();
    return result.results;
};

export const getFormPage = async (formID: number, index: number) => {
    const query = `SELECT * FROM pages WHERE form_id = ? AND page_index = ?`;
    return await env.DB.prepare(query).bind(formID, index).first<DBPage>();
};

export const getPageQuestions = async (pageID: number) => {
    const query = `SELECT * FROM questions WHERE page_id = ? ORDER BY question_index ASC`;
    const result = await env.DB.prepare(query).bind(pageID).all<DBQuestion>()
    return result.results;
};

export const getPageQuestion = async (pageID: number, index: number) => {
    const query = `SELECT * FROM questions WHERE page_id = ? AND question_index = ?`;
    return await env.DB.prepare(query).bind(pageID, index).first<DBQuestion>();
};

