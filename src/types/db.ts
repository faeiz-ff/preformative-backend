
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
};
