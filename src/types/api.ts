import { FormSchema } from "schema/forms-schema";
import { PageSchema } from "schema/page-schema";
import { QuestionSchema } from "schema/question-schema";
import { AnswerSchema } from "schema/submission-schema";

export type User = {
    username: string;
};

export type Form = FormSchema & {
    isPublic: boolean;
    publicID: string;
    createdAt: string;
};

export type FormInfo = Omit<Form, 'pages'>;

export type Page = PageSchema;

export type PageInfo = Omit<Page, 'questions'>;

export type Question = QuestionSchema;

export type Submission = {
    createdAt: string;
    answers: Answer[];
}

export type Answer = AnswerSchema;


