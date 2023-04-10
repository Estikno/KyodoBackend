import {Schema} from 'mongoose';

export default interface IClientResponse {
    status: boolean;
    message: string;
    token?: string;
    user?: IUserResponse[];
    room?: string;
}

export interface IUserResponse {
    username: string;
    email: string;
    avatarUrl: string;
    verified: boolean;
    idRoom?: string;
}