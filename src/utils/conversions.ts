import { Answer, Form, FormInfo, Page, PageInfo, Question, Submission } from "../types/api";
import { DBForm, DBPage, DBQuestion, DBSubmission } from "../types/db"

export const transformFormSafe = (f: DBForm) => {
    return {
        title: f.title,
        description: f.description,
        isPublic: f.is_public,
        publicID: f.public_id,
        createdAt: f.created_at,
    } as FormInfo;
};

export const transformPageSafe : (q:DBPage) => PageInfo = (p: DBPage) => {
    const config : any = JSON.parse(p.config);
    switch (p.type) {
        case 'branch': 
            return {
                type: 'branch',
                description: p.description,
                condition: config.condition,
            }
        case 'basic':
            return {
                type: 'basic',
                description: p.description,
                next: config.next
            }
        case 'submit':
            return {
                type: 'submit',
                description: p.description,
            }
        default:
            throw new Error('bad page type');
    }
};

export const transformQuestion : (q:DBQuestion) => Question = (q: DBQuestion) => {
    const config : any = JSON.parse(q.config);
    switch (q.type) {
        case 'text':
            return {
                type: 'text',
                prompt: q.prompt,
                name: q.name,
                isRequired: q.is_required === 1 ? true : false,
                isNumberOnly: config.isNumberOnly
            } 
        case 'textarea':
            return {
                type: 'textarea',
                prompt: q.prompt,
                isRequired: q.is_required === 1 ? true : false,
                name: q.name
            }
        case 'checkbox':
            return {
                type: 'checkbox',
                prompt: q.prompt,
                isRequired: q.is_required === 1 ? true : false,
                name: q.name,
                choices: config.choices,
                minimumOf: config.minimumOf
            }
        case 'singlechoice': 
            return {
                type: 'singlechoice',
                prompt: q.prompt,
                isRequired: q.is_required === 1 ? true : false,
                name: q.name,
                choices: config.choices,
            }
        default:
            throw new Error('bad question type');
    }
};

export const transformFormFull = (f: DBForm) => {
    return {
        ...transformFormSafe(f),
        pages: []
    } as Form;
};

export const transformPageFull = (p: DBPage) => {
    return {
        ...transformPageSafe(p),
        questions: []
    } as Page;
}

export const transformSubmission = (s: DBSubmission) => {
    const answers = JSON.parse(s.answers) as Answer[];
    return {
        createdAt: s.created_at,
        answers
    } as Submission;
}


