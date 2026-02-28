import { FormSchema } from "schema/forms-schema";
import { PageSchema } from "schema/page-schema";
import { QuestionSchema } from "schema/question-schema";


export type User = {
    username: string;
};

export type Form = FormSchema & {
    isPublic: boolean;
    publicID: string;
    createdAt: string;
    pages: Page[];
};

export type FormInfo = Omit<Form, 'pages'>;

export type Page = PageSchema & {
    questions: Question[]
}

export type PageInfo = PageSchema;

export type Question = QuestionSchema;

export type Submission = {
    createdAt: string;
    answers: Answer[];
};

export type Answer = {
    value: string;
};

