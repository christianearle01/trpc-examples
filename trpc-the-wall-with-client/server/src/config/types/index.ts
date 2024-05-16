import { Request, Response } from 'express';
import { Session } from 'express-session';

export type APIContext = {
    readonly req: Request & {
        readonly session: Session & {
            user?: {
                id: number;
                first_name: string;
                name: string;
                date_time: string;
            }
        }
    }
    readonly res: Response
}

export type FetchUserByEmail = {
    id: number;
    email_address: string;
}

export type RegisterUserParams = {
    first_name: string;
    last_name: string;
    email_address: string;
    password: string;
    confirm_password?: string;
}

export type LoginUserParams = {
    email_address: string;
    password: string;
}

export type CreateMessageParams = {
    user_id: number;
    content: string;
}

export type DeleteMessageParams = {
    message_id: number;
    user_id: number;
}

export type MessagesResultData = {
    id: number;
    name: string; 
    content: string;
    comments: string;
    created_at: string;
}

export type FetchCommentData = { 
    status: boolean;
    result: [{ comment_created_at: string }];
    error: unknown ;
};

export type FetchDateTime<T> = { 
    status: boolean;
    result: T;
    error: unknown;
};

export type FetchUserData = {
    id: number;
    first_name: string;
    name: string;
    email_address: string;
    password: string;
    created_at: string
}