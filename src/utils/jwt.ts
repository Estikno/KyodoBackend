import jwt from "jsonwebtoken";
import config from "../config";
import IJwt from "../interfaces/IJWT";

/**
 * Creates a JSON Web Token (JWT) with a user id and an expiration time based on a JWT secret
 * @param user_id the user's id to put it into the token
 * @returns Generated token as a string
 */
export function createToken(user_id: string): string {
    const token = jwt.sign({ id: user_id }, config.JWT_SECRET as string, {
        expiresIn: config.JWT_DURATION,
    });

    return token;
}

/**
 * Verifies if a given JWT token is valid or not
 * @param token token to verify
 * @returns If the decoding is successful, it returns true; otherwise, it returns false
 */
export function verifyToken(token: string): boolean {
    try {
        jwt.verify(token, config.JWT_SECRET as string); //the decoded token will be an _id of an user or an

        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Decodes a JWT token
 * @param token token to decode
 * @returns The user id contained in it as a string
 */
export function getTokenContent(token: string): string {
    const { id } = jwt.decode(token) as IJwt;
    return id;
}
