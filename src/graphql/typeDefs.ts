import { gql } from "graphql-tag";

export default gql`
    type Query {
        verifySession(token: String!): IClientResponse
        verifiedUser(token: String!): IClientResponse
    }

    type Mutation {
        register(username: String!, password: String!, email: String!) : IClientResponse
        login(username: String!, password: String!) : IClientResponse
        verification(token: String!): IClientResponse
        removeAvatar(token: String!) : IClientResponse
        changePassword(oldPassword: String!, newPassword: String!, token: String!): IClientResponse
    }

    type IClientResponse {
        status: Boolean
        message: String
        token: String
        user: [User]
        room: String
    }

    type User {
        username: String
        email: String
        avatarImageUrl: String
        verified: Boolean
    }
`;
