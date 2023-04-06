import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import IClientResponse from "../interfaces/IClientResponse";
import { createToken, verifyToken } from "../utils/jwt";
import { verifyTokenGraphql } from "../middlewares/authJwt";
import { sendVerificationEmail } from "../utils/email";
import jwt from "jsonwebtoken";
import config from "../config";
import IJwt from "../interfaces/IJWT";

/**
 * * This function registers the user and creates a new user in the database
 */
export async function register(req: Request, res: Response): Promise<Response> {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.json({
            message: "Missing fields",
            status: false,
        } as IClientResponse);
    }

    const userCheck = await User.findOne({ username: username });
    const emailCheck = await User.findOne({ email: email });

    if (userCheck || emailCheck) {
        return res.json({
            message: "User already exists. Email or passowrd is repeated",
            status: false,
        } as IClientResponse);
    }

    const newUser = new User({ username, password, email });
    await newUser.save();

    const token: string = createToken(newUser._id);

    //email verification
    const verification_token: string = createToken(newUser.username);
    sendVerificationEmail(
        newUser.email,
        `http://localhost:5173/email-confirm/${verification_token}`,
        newUser.username
    );

    return res.json({
        message: "User created",
        status: true,
        token: token,
    } as IClientResponse);
}

/**
 * Same as register method but for graphql
 * @param username the user's username
 * @param password the user's password
 * @param email the user's email address
 * @returns Response with status, message, token and user information
 */
export async function registerGraphql(
    username: String,
    password: String,
    email: String
): Promise<IClientResponse> {
    if (!username || !password || !email) {
        return {
            message: "Missing fields",
            status: false,
        } as IClientResponse;
    }

    const userCheck = await User.findOne({ username: username });
    const emailCheck = await User.findOne({ email: email });

    if (userCheck || emailCheck) {
        return {
            message: "User already exists. Email or user is repeated",
            status: false,
        } as IClientResponse;
    }

    const newUser = new User({ username, password, email });
    await newUser.save();

    const token: string = createToken(newUser._id);

    //email verification
    //const verification_token: string = createToken(newUser.username);
    //sendVerificationEmail(newUser.email, `http://localhost:5173/email-confirm/${verification_token}`, newUser.username);

    return {
        message: "User created",
        status: true,
        token: token,
    } as IClientResponse;
}

/**
 * * This function logs the user in and returns the user if the credentials are correct
 */
export async function login(req: Request, res: Response): Promise<Response> {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({
            message: "Missing fields",
            status: false,
        } as IClientResponse);
    }

    const userCheck = await User.findOne({ username: username });

    if (!userCheck) {
        return res.json({
            message: "Incorrect username or password",
            status: false,
        } as IClientResponse);
    }

    const isPasswordCorrect = await userCheck.comparePassword(password);

    if (!isPasswordCorrect) {
        return res.json({
            message: "Incorrect username or password",
            status: false,
        } as IClientResponse);
    }

    const token: string = createToken(userCheck._id);

    return res.json({
        message: "Logged in",
        status: true,
        token: token,
    } as IClientResponse);
}


/**
 * Same as login method but for graphql
 * @param username the user's username
 * @param password the user's password
 * @returns Response with status, message, token and user information
 */
export async function loginGraphql(
    username: String,
    password: String
): Promise<IClientResponse> {
    if (!username || !password) {
        return {
            message: "Missing fields",
            status: false,
        } as IClientResponse;
    }

    const userCheck = await User.findOne({ username: username });

    if (!userCheck) {
        return {
            message: "Incorrect username or password",
            status: false,
        } as IClientResponse;
    }

    const isPasswordCorrect = await userCheck.comparePassword(
        password.toString()
    );

    if (!isPasswordCorrect) {
        return {
            message: "Incorrect username or password",
            status: false,
        } as IClientResponse;
    }

    const token: string = createToken(userCheck._id);

    return {
        message: "Logged in",
        status: true,
        token: token,
    } as IClientResponse;
}

export function verifySession(req: Request, res: Response): Response {
    const token: string = req.headers["token"] as string;

    if (!token || token === "")
        return res.json({
            message: "Token is necessary",
            status: false,
        } as IClientResponse);

    return res.json({
        message: "Token verified",
        status: verifyToken(token),
    } as IClientResponse);
}

/**
 * Sees if the token provided is valid
 * @param token the current session`s token
 * @returns Response with status and message
 */
export function verifySessionGraphql(token: String): IClientResponse {
    const _token: string = token.toString();

    if (!_token || _token === "")
        return {
            message: "Token is necessary",
            status: false,
        } as IClientResponse;

    return {
        message: "Token verified",
        status: verifyToken(_token),
    } as IClientResponse;
}

export async function verification(
    req: Request,
    res: Response
): Promise<Response> {
    const token: string = req.params.token;

    try {
        const { id } = jwt.verify(token, config.JWT_SECRET as string) as IJwt;
        await User.findOneAndUpdate({ username: id }, {
            email_verified: true,
        } as IUser);
        return res.json({
            message: "Email verified",
            status: true,
        } as IClientResponse);
    } catch (err) {
        return res.json({
            message: "Token is invalid",
            status: false,
        } as IClientResponse);
    }
}


/**
 * Changes the email's verification parameter to true
 * @param token the session's token
 * @returns Response with status and message
 */
export async function verificationGraphql(
    token: String
): Promise<IClientResponse> {
    try {
        const { id } = jwt.verify(
            token.toString(),
            config.JWT_SECRET as string
        ) as IJwt;
        await User.findOneAndUpdate({ username: id }, {
            email_verified: true,
        } as IUser);
        return { message: "Email verified", status: true } as IClientResponse;
    } catch (err) {
        return {
            message: "Token is invalid",
            status: false,
        } as IClientResponse;
    }
}

export async function verifiedUser(
    req: Request,
    res: Response
): Promise<Response> {
    const user_id: string = req.body.user_id;
    const _user: IUser | null = await User.findById(user_id);

    if (!_user)
        return res.json({
            message: "User not found",
            status: false,
        } as IClientResponse);

    return res.json({
        message: "User verified",
        status: true,
        user: { verified: _user.email_verified },
    } as IClientResponse);
}


/**
 * Sees if the session token is valid and that the user attached to it exists
 * @param token the session's token
 * @returns Response with message, status and the user's information
 */
export async function verifiedUserGraphql(
    token: String
): Promise<IClientResponse> {
    const user_id = verifyTokenGraphql(token);

    if (user_id === null)
        return {
            message: "Something went wrong with the token",
            status: false,
        } as IClientResponse;

    const _user: IUser | null = await User.findById(user_id);

    if (!_user)
        return { message: "User not found", status: false } as IClientResponse;

    return {
        message: "User verified",
        status: true,
        user: [
            {
                verified: _user.email_verified,
                avatarUrl: _user.avatarImage.avatarImageUrl,
                username: _user.username,
                email: _user.email
            },
        ],
    } as IClientResponse;
}
