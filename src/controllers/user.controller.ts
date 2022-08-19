import { Request, Response } from "express";
import User, { IUser } from "../models/User";

/**
 * Get all users
 */
export async function getUsers(req: Request, res: Response): Promise<Response> {
    return res.json(await User.find());
}

/**
 * Get user by id
 */
export async function getUser(req: Request, res: Response): Promise<Response> {
    if(!req.params.id) {
        return res.json({
            message: "Missing id",
            status: false
        });
    }

    const foundUser = await User.findById(req.params.id);

    if (foundUser) {
        return res.json({user: foundUser, status: true});
    }

    return res.json({ message: "User not found" , status: false});
}

/**
 * Create a new user
 * * Need the IUser structure to create a new user, also found in the model script (This goes in the request body)
 * ! This function is deprecated, use the register function in the auth controller instead
 */
export async function createUser(
    req: Request,
    res: Response
): Promise<Response> {
    if (!req.body.email || !req.body.username || !req.body.password) {
        return res.status(400).json({
            message: "Missing fields",
        });
    }

    const userEmail = await User.findOne({ email: req.body.email });
    const userName = await User.findOne({ username: req.body.username });

    if (userEmail || userName) {
        return res.status(400).json({
            message: "User already exists. Email or passowrd is repeated",
        });
    }

    const newUser = new User(req.body);
    await newUser.save();

    return res.status(201).json(newUser);
}

/**
 * Delete a user by id or username
 * * Need this structure in the body: {type: 'id' || 'username'}
 */
export async function deleteUser(
    req: Request,
    res: Response
): Promise<Response> {
    if (!req.body.type)
        return res.status(400).json({
            message: "The type of search has not been said in the body",
        });

    if (req.body.type !== "id" && req.body.type !== "username")
        return res.status(400).json({ message: "Invalid type of search" });

    if (req.body.type === "id") {
        let user = null;

        try {
            user = await User.findByIdAndDelete(req.params.id);
        } catch (err) {
            return res
                .status(500)
                .json({ message: "Internal server error, error: " + err });
        }

        if (!user) return res.status(404).json({ message: "User not found" });

        return res.json(user);
    } else {
        let user = null;

        try {
            user = await User.findOneAndDelete({ username: req.params.id });
        } catch (err) {
            return res
                .status(500)
                .json({ message: "Internal server error, error: " + err });
        }

        if (!user) return res.status(404).json({ message: "User not found" });

        return res.json(user);
    }
}

/**
 * Update a user by id or username
 * TODO: Review this function, it needs to be updated
 * ! Do not use this function, it needs to be updated
 */
export async function updateUser(
    req: Request,
    res: Response
): Promise<Response> {
    //* Check if the user exists and if the body is valid
    if (!req.body.type)
        return res.status(400).json({
            message: "The type of search has not been said in the body",
        });

    if (req.body.type !== "id" && req.body.type !== "username")
        return res.status(400).json({ message: "Invalid type of search" });

    if (req.body.username) {
        if (await User.findOne({ username: req.body.username }))
            return res
                .status(400)
                .json({ message: "Cant update username, it is repeated" });
    }

    if (req.body.email) {
        if (await User.findOne({ email: req.body.email }))
            return res
                .status(400)
                .json({ message: "cannt update email, it is repeated" });
    }

    //* Update the user depending on the type of search
    if (req.body.type === "id") {
        let user = null;

        try {
            user = await User.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });
        } catch (err) {
            return res
                .status(500)
                .json({ message: "Internal server error, error: " + err });
        }

        if (!user) return res.status(404).json({ message: "User not found" });

        return res.json(user);
    } else {
        let user = null;

        try {
            user = await User.findOneAndUpdate(
                { username: req.params.id },
                req.body,
                { new: true }
            );
        } catch (err) {
            return res
                .status(500)
                .json({ message: "Internal server error, error: " + err });
        }

        if (!user) return res.status(404).json({ message: "User not found" });

        return res.json(user);
    }
}