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

export default {
    Query: {
        verifySession: (_: any, { token }: { token: String }) => {
            return verifySessionGraphql(token);
        },
        verifiedUser: async (_: any, { token }: { token: String }) => {
            return await verifiedUserGraphql(token);
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
        }
    },
};
