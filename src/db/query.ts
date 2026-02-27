import { env } from "cloudflare:workers";
import { Form, User } from "../types/db";

export const insertUser = async (username: string, password: string) => {
    const query = `INSERT INTO users (username, password) VALUES ( ?, ? ) RETURNING id;`;
    const result = await env.DB.prepare(query).bind(username, password).run<User>();

    if (!result.success) {
        throw new Error(result.error)
    }

    return result.results[0].id;
};

export const getUserFromName = async (username: string) => {
    const query = `SELECT * FROM users WHERE username = ?`;
    const result = await env.DB.prepare(query).bind(username).first<User>();

    if (!result) {
        throw new Error();
    } 
    
    return result;
};

export const getUserFromID = async (userID: number) => {
    const query = `SELECT * FROM users WHERE id = ?`;
    const result = await env.DB.prepare(query).bind(userID).first<User>();

    if (!result) {
        throw new Error();
    }

    return result;
};

export const getUserForms = async (userID: number) => {
    const query = `SELECT * FROM forms WHERE user_id = ?`;
    const result = await env.DB.prepare(query).bind(userID).all<Form[]>();

    if (!result.success) {
        throw new Error(result.error);
    }

    return result.results;
};

