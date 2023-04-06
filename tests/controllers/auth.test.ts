import {
    registerGraphql,
    loginGraphql,
} from "../../src/controllers/auth.controller";
import IClientResponse from "../../src/interfaces/IClientResponse";
import User from "../../src/models/User"; // import the User model
import * as db from "../../src/database";

describe("registerGraphql", () => {
    let clientResponse: IClientResponse;

    beforeAll(async () => {
        await db.connectDB();
    });

    afterAll(async () => {
        // Cleanup any data created during the test
        await User.findOneAndDelete({ username: "testuser" });
        await User.findOneAndDelete({ username: "testuser2" });
        await User.findOneAndDelete({ username: "testuser3" });

        //close the database
        await db.closeDB();
    });

    it("should return an error response if a required field is missing", async () => {
        clientResponse = await registerGraphql("", "12345678", "test@test.com");

        expect(clientResponse.status).toBe(false);
        expect(clientResponse.message).toBe("Missing fields");

        clientResponse = await registerGraphql("username", "", "test@test.com");

        expect(clientResponse.status).toBe(false);
        expect(clientResponse.message).toBe("Missing fields");

        clientResponse = await registerGraphql("username", "12345678", "");

        expect(clientResponse.status).toBe(false);
        expect(clientResponse.message).toBe("Missing fields");
    });

    it("should return an error response if a user with the same username or email already exists", async () => {
        // Create a user with the same username
        const existingUser = new User({
            username: "testuser",
            password: "12345678",
            email: "testuser@test.com",
        });
        await existingUser.save();

        // Test with the same username
        clientResponse = await registerGraphql(
            "testuser",
            "12345678",
            "testuser2@test.com"
        );

        expect(clientResponse.status).toBe(false);
        expect(clientResponse.message).toBe(
            "User already exists. Email or user is repeated"
        );

        // Create a user with the same email
        const existingUser2 = new User({
            username: "testuser2",
            password: "12345678",
            email: "testuser2@test.com",
        });
        await existingUser2.save();

        // Test with the same email
        clientResponse = await registerGraphql(
            "testuser3",
            "12345678",
            "testuser2@test.com"
        );

        expect(clientResponse.status).toBe(false);
        expect(clientResponse.message).toBe(
            "User already exists. Email or user is repeated"
        );
    });

    it("should create a new user and return a success response", async () => {
        clientResponse = await registerGraphql(
            "testuser3",
            "12345678",
            "testuser3@test.com"
        );

        expect(clientResponse.status).toBe(true);
        expect(clientResponse.message).toBe("User created");
        expect(clientResponse.token).toBeTruthy();

        // Check that the user was actually created
        const user = await User.findOne({ username: "testuser3" });

        expect(user).toBeTruthy();
        expect(user?.username).toBe("testuser3");
        expect(user?.email).toBe("testuser3@test.com");
    });
});

describe("loginGraphql function", () => {
    beforeAll(async () => {
        await db.connectDB();
    });

    afterAll(async () => {
        //close the database
        await db.closeDB();
    });

    it("should return an error message if username or password is missing", async () => {
        const result = await loginGraphql("", "");
        expect(result.status).toBe(false);
        expect(result.message).toBe("Missing fields");
    });

    it("should return an error message if user does not exist", async () => {
        //jest.spyOn(User, "findOne").mockResolvedValueOnce(null);
        const result = await loginGraphql("nonexistent", "12345678");
        expect(result.status).toBe(false);
        expect(result.message).toBe("Incorrect username or password");
    });

    it("should return an error message if password is incorrect", async () => {
        /*jest.spyOn(User.prototype, "comparePassword").mockResolvedValueOnce(
            false
        );*/
        const result = await loginGraphql("estikno", "incorrect");
        expect(result.status).toBe(false);
        expect(result.message).toBe("Incorrect username or password");
    });

    it("should return a success message and a token if user logs in successfully", async () => {
        /*jest.spyOn(User.prototype, "comparePassword").mockResolvedValueOnce(
            true
        );
        jest.spyOn(User, "findOne").mockResolvedValueOnce({
            _id: "1234",
            username: "existing",
            email: "existing@example.com",
        });*/
        const result = await loginGraphql("estikno", "12345678");
        expect(result.status).toBe(true);
        expect(result.message).toBe("Logged in");
        expect(result.token).toBeTruthy();
    });
});
