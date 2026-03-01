
export type DBUser = {
    username: string;
    password: string;
    id: number;
};

export type DBForm = {
    id: number;
    title: string;
    description: string;
    user_id: number;
    is_public: boolean;
    public_id: string;
    created_at: string;
};

export type DBPage = {
    id: number;
    description: string;
    type: string;
    config: string;
    page_index: number;
    form_id: number;
};

export type DBQuestion = {
    id: number;
    prompt: string;
    name: string;
    is_required: number;
    page_id: number;
    type: string;
    config: string;
    question_index: number;
};

export type DBSubmission = {
    id: number;
    form_id: number;
    answers: string;
    created_at: string;
};

