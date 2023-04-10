import {
    getUserGraphql,
    updateUserGraphql,
} from "../../src/controllers/user.controller";
import IClientResponse from "../../src/interfaces/IClientResponse";
import User, { IUser } from "../../src/models/User"; // import the User model
import * as db from "../../src/database";
import { createToken } from "../../src/utils/jwt";

describe("getUserGraphql", () => {
    let user: IUser;
    let token: string;

    beforeAll(async () => {
        //start the database
        await db.connectDB();

        //create a valid user
        user = new User({
            username: "testuser2",
            password: "oldpassword",
            email: "testuseruser@example.com",
        });
        await user.save();

        token = createToken(user._id);
    });

    afterAll(async () => {
        //delete the valid user used for testing
        await User.findOneAndDelete({ username: "testuser2" });

        //close the database
        await db.closeDB();
    });

    it("should return an error if the token is not valid", async () => {
        const _token = createToken("");
        const username = "test_user";

        const result = await getUserGraphql(_token, username);

        expect(result.status).toBe(false);
        expect(result.message).toBe(
            "An error occurred, please try again later"
        );
    });

    it("should return an error if the token does not belong to a valid user", async () => {
        const _token = createToken("61676cc6909ac46f12345678");
        const username = "test_user";

        const result = await getUserGraphql(_token, username);

        expect(result.status).toBe(false);
        expect(result.message).toBe("Not valid token");
    });

    it("should return an error if the user being searched for does not exist", async () => {
        const username = "nonexistent_user";

        const result = await getUserGraphql(token, username);

        expect(result.status).toBe(false);
        expect(result.message).toBe("Not valid username");
    });

    it("should return the user details if they exist and the token is valid", async () => {
        const username = "estikno";

        const result = await getUserGraphql(token, username);

        expect(result.status).toBe(true);
        expect(result.message).toBe("User found");

        if (result.user) expect(result.user[0].username).toBe(username);
    });
});

describe("updateUserGraphql", () => {
    let token: string;
    let updatedInfo: { username: string; email: string };

    beforeAll(async () => {
        //start the database
        await db.connectDB();

        //create a valid user
        const userFirst = new User({
            username: "testuserUpdate",
            password: "oldpassword",
            email: "testuseruserUpdate@example.com",
        });
        await userFirst.save();

        token = createToken(userFirst._id);
    });

    afterAll(async () => {
        //delete the valid user used for testing
        await User.findOneAndDelete({ username: "new-username" });

        //close the database
        await db.closeDB();
    });

    it("returns an error message if token is not provided", async () => {
        const response = await updateUserGraphql("", {} as any);

        expect(response.status).toBe(false);
        expect(response.message).toEqual("Token not valable or not provided");
    });

    it("returns an error message if user not found", async () => {
        const _token = createToken("61676cc6909ac46f12345678");

        const response = await updateUserGraphql(_token, {
            username: "new-username",
        } as any);

        expect(response.status).toBe(false);
        expect(response.message).toEqual("User not found");
    });

    it("updates user username if provided in updateInfo", async () => {
        updatedInfo = { username: "new-username", email: "" };

        const response = await updateUserGraphql(token, updatedInfo);

        const user = await User.findOne({ username: "new-username" });

        expect(user).toBeTruthy();
        expect(response.status).toBe(true);
        expect(response.message).toEqual("User updated");

        if (user) expect(user.username).toEqual(updatedInfo.username);
    });

    it("updates user email if provided in updateInfo", async () => {
        updatedInfo = { email: "new-emailupdated@example.com", username: "" };

        const response = await updateUserGraphql(token, updatedInfo);

        const user = await User.findOne({ username: "new-username" });

        expect(user).toBeTruthy();
        expect(response.status).toBe(true);
        expect(response.message).toEqual("User updated");

        if (user) {
            expect(user.email).toEqual(updatedInfo.email);
            expect(user.email_verified).toBe(false);
        }
    });
});
