

export type User = {
    username: string;
    password: string;
    id: number;
};

export type Form = {
    id: number;
    title: string;
    description: string;
    userID: number;
    isPublic: boolean;
    publicID: string;
    createdAt: string;
    pages: Page[];
};


export type FormInfo = Omit<Form, 'pages'>;
export type FormSafe = Omit<FormInfo, 'id' | 'userID'>;

export type Page = {
    id: number;
    description: string;
    type: 'branch' | 'basic' | 'submit';
    pageIndex: number;
    formID: number;
    questions: Question[];
};

export type PageInfo = Omit<Page, 'questions'>;
export type PageSafe = Omit<PageInfo, 'id' | 'formID'>;

export type Question = {
    id: number;
    prompt: string;
    pageID: number;
    type: 'text' | 'textarea' | 'singlechoice' | 'checkbox';
    config: string;
    questionIndex: number;
};

export type QuestionSafe = Omit<Question, 'id' | 'pageID'>;

export type Submission = {
    id: number;
    formID: number;
    createdAt: string;
    answers: Answer[];
};

export type Answer = {
    id: number;
    submissionID: number;
    questionID: number;
    value: string;
};
