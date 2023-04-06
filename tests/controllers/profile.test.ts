import {
    changePasswordGraphql,
    removeAvatarGraphql,
} from "../../src/controllers/profile.controller";
import IClientResponse from "../../src/interfaces/IClientResponse";
import User, { IUser } from "../../src/models/User"; // import the User model
import * as db from "../../src/database";
import { createToken } from "../../src/utils/jwt";
import { uploadImage, deleteImage } from "../../src/utils/cloudinary";
import { UploadApiOptions, UploadApiResponse } from "cloudinary";

describe("changePasswordGraphql function", () => {
    let user: IUser;
    let token: string;

    beforeAll(async () => {
        await db.connectDB();
    });

    afterAll(async () => {
        //close the database
        await db.closeDB();
    });

    beforeEach(async () => {
        user = new User({
            username: "testuser",
            password: "oldpassword",
            email: "testuser@example.com",
        });
        await user.save();

        token = createToken(user._id);
    });

    afterEach(async () => {
        await User.findOneAndDelete({ username: "testuser" });
    });

    it("should return error if old password is incorrect", async () => {
        const response = await changePasswordGraphql(
            "wrongpassword",
            "newpassword",
            token
        );
        expect(response).toEqual({
            status: false,
            message: "Old password is incorrect",
        });
    });

    it("should return error if old password is missing", async () => {
        const response = await changePasswordGraphql("", "newpassword", token);
        expect(response).toEqual({
            status: false,
            message: "Missing passwords",
        });
    });

    it("should return error if new password is missing", async () => {
        const response = await changePasswordGraphql("oldpassword", "", token);
        expect(response).toEqual({
            status: false,
            message: "Missing passwords",
        });
    });

    it("should return error if user is not found", async () => {
        const fakeUserId = "61676cc6909ac46f12345678";
        const fakeToken = createToken(fakeUserId);
        const response = await changePasswordGraphql(
            "oldpassword",
            "newpassword",
            fakeToken
        );
        expect(response).toEqual({
            status: false,
            message: "User not found",
        });
    });

    it("should change password successfully", async () => {
        const response = await changePasswordGraphql(
            "oldpassword",
            "newpassword",
            token
        );
        expect(response).toEqual({
            status: true,
            message: "Password changed",
        });

        // Verify that the user's password has been updated in the database
        const updatedUser = await User.findById(user._id);
        expect(updatedUser).toBeTruthy();

        const isPasswordCorrect = await updatedUser?.comparePassword(
            "newpassword"
        );
        expect(isPasswordCorrect).toBe(true);
    });
});

describe("removeAvatarGraphql", () => {
    let user: IUser;
    let token: string;
    let image: UploadApiResponse;
    let userImage: IUser;
    let tokenImage: string;

    beforeAll(async () => {
        //set up the database
        await db.connectDB();

        //upload the needed image
        const options: UploadApiOptions = {
            folder: "kyodo/avatars",
            aspect_ratio: "1:1",
            gravity: "auto",
            opacity: 100,
            radius: "max",
            width: 300,
            crop: "fill",
            format: "png",
        };

        image = await uploadImage(
            "C:/Users/david/Desktop/Kyodo/backend/uploads/placeholderTestImage.png",
            options
        );

        //create the user with the image
        userImage = new User({
            username: "testuserImage",
            password: "oldpassword",
            email: "testuserImage@example.com",
            avatarImage: {
                avatarImageUrl: image.secure_url,
                avatarImagePublicId: image.public_id,
            },
        });
        await userImage.save();

        tokenImage = createToken(userImage._id);
    });

    afterAll(async () => {
        //delete the image
        await deleteImage(userImage.avatarImage.avatarImagePublicId);

        //delete the user that has uploaded the image
        await User.findOneAndDelete({ username: "testuserImage" });

        //close the database
        await db.closeDB();
    });

    beforeEach(async () => {
        user = new User({
            username: "testuser",
            password: "oldpassword",
            email: "testuser@example.com",
        });
        await user.save();

        token = createToken(user._id);
    });

    afterEach(async () => {
        await User.findOneAndDelete({ username: "testuser" });
    });

    it("should return error if user_id is null", async () => {
        const _token = "invalidToken";
        const response = await removeAvatarGraphql(_token);
        const expectedResponse: IClientResponse = {
            message: "Something went wrong with the token",
            status: false,
        };
        expect(response).toEqual(expectedResponse);
    });

    it("should return error if user not found", async () => {
        const _token = createToken("61676cc6909ac46f12345678");
        const response = await removeAvatarGraphql(_token);
        const expectedResponse: IClientResponse = {
            message: "User not found",
            status: false,
        };
        expect(response).toEqual(expectedResponse);
    });

    it("should return error if already with default avatar", async () => {
        const response = await removeAvatarGraphql(token);
        const expectedResponse: IClientResponse = {
            message: "Already with the default avatar",
            status: false,
        };
        expect(response).toEqual(expectedResponse);
    });

    it("should return success if avatar removed successfully", async () => {
        const response = await removeAvatarGraphql(tokenImage);
        const expectedResponse: IClientResponse = {
            message:
                "Avatar removed successfully. Reload the page to see the changes",
            status: true,
        };
        expect(response).toEqual(expectedResponse);
    });
});
