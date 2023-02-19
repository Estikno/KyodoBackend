import { registerGraphql, loginGraphql, verifySessionGraphql } from "../controllers/auth.controller";

export default {
    Query: {
        hello: () => "Hello world!",
        verifySessionGraphql: (_: any, { token }: { token: String }) => {
            return verifySessionGraphql(token);
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
    },
};
