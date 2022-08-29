export default interface IClientResponse {
    status: boolean;
    message: string;
    token?: string;
    user?: IUserResponse;
}

export interface IUserResponse {
    username: string;
    email: string;
    avatarUrl: string;
}