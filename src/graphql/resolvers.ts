import { registerGraphql } from "../controllers/auth.controller";

export default {
    Query: {
        hello: () => "Hello world!",
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
    },
};
