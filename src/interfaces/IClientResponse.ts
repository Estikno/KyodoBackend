export default interface IClientResponse {
    status: boolean;
    message: string;
    token?: string;
    user?: IUserResponse | IUserResponse[];
}

export interface IUserResponse {
    username: string;
    email: string;
    avatarUrl: string;
}