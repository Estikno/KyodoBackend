import { gql } from "graphql-tag";

export default gql`
    type Query {
        hello: String
    }

    type Mutation {
        register(username: String, password: String, email: String) : IClientResponse
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
        password: String
        email: String
        avatarImage: ImageContent
        email_verified: Boolean
        createdAt: String
        updatedAt: String
    }

    type ImageContent {
        avatarImageUrl: String
        avatarImagePublicId: String
    }
`;
