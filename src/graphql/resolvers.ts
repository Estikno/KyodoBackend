import {
    registerGraphql,
    loginGraphql,
    verifySessionGraphql,
    verificationGraphql,
    verifiedUserGraphql,
} from "../controllers/auth.controller";
import {
    removeAvatarGraphql,
    changePasswordGraphql,
} from "../controllers/profile.controller";
import {
    getUsersGraphql,
    getUserGraphql,
    updateUserGraphql
} from "../controllers/user.controller";
import { IUser } from "../models/User";

export default {
    Query: {
        verifySession: (_: any, { token }: { token: String }) => {
            return verifySessionGraphql(token);
        },
        verifiedUser: async (_: any, { token }: { token: String }) => {
            return await verifiedUserGraphql(token);
        },
        getUsers: async (_: any, { token }: { token: String }) => {
            return await getUsersGraphql(token);
        },
        getUser: async (
            _: any,
            { token, username }: { token: String; username: String }
        ) => {
            return await getUserGraphql(token, username);
        },
    },

    Mutation: {
        register: async (
            _: any,
            {
                username,
                password,
                email,
            }: { username: String; password: String; email: String }
        ) => {
            return await registerGraphql(username, password, email);
        },
        login: async (
            _: any,
            { username, password }: { username: String; password: String }
        ) => {
            return await loginGraphql(username, password);
        },
        verification: async (_: any, { token }: { token: String }) => {
            return await verificationGraphql(token);
        },
        removeAvatar: async (_: any, { token }: { token: String }) => {
            return await removeAvatarGraphql(token);
        },
        changePassword: async (
            _: any,
            {
                oldPassword,
                newPassword,
                token,
            }: { oldPassword: String; newPassword: String; token: String }
        ) => {
            return await changePasswordGraphql(
                oldPassword.toString(),
                newPassword.toString(),
                token
            );
        },
        updateUser: async (
            _: any,
            { token, updateUser }: { token: String; updateUser: IUser }
        ) => {
            return await updateUserGraphql(token, updateUser as IUser);
        },
    },
};
