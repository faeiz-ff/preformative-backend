import { Form, FormSafe, Page, PageSafe, Question, QuestionSafe } from "../types/api";
import { DBForm, DBPage, DBQuestion } from "../types/db"

export const transformFormSafe = (f: DBForm) => {
    return {
        title: f.title,
        description: f.description,
        isPublic: f.is_public,
        publicID: f.public_id,
        createdAt: f.created_at,
    } as FormSafe;
};

export const transformPageSafe = (p: DBPage) => {
    return {
        description: p.description,
        type: p.type,
        pageIndex: p.page_index,
    } as PageSafe;
};

export const transformQuestionSafe = (q: DBQuestion) => {
    return {
        prompt: q.prompt,
        type: q.type,
        config: q.config,
        questionIndex: q.question_index
    } as QuestionSafe;
};

export const transformFormFull = (f: DBForm) => {
    return {
        id: f.id,
        userID: f.user_id,
        ...transformFormSafe(f),
    } as Form;
};

export const transformPageFull = (p: DBPage) => {
    return {
        id: p.id,
        formID: p.form_id,
        ...transformPageSafe(p),
    } as Page;
};

export const transformQuestionFull = (q: DBQuestion) => {
    return {
        id: q.id,
        pageID: q.page_id,
        ...transformQuestionSafe(q),
    } as Question;
};

