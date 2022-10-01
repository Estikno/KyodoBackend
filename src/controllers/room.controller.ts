import { Request, Response } from "express";
import IClientResponse from "../interfaces/IClientResponse";
import Room, { IRoom } from "../models/Room";
import User, { IUser } from "../models/User";
import RoomUser, { IRoomUser } from "../models/RoomUser";
import { createRoom } from "../utils/room.util";

export async function getRoom(req: Request, res: Response): Promise<Response> {
    if (!req.body.user_id)
        return res.json({
            message: "User id not found",
            status: false,
        } as IClientResponse);

    const user_id = req.body.user_id;
    const foundedUser = await User.findById(user_id);

    if (!foundedUser)
        return res.json({
            message: "User not found",
            status: false,
        } as IClientResponse);
    if (!req.body.ofu)
        return res.json({
            message: "Username friend (ofu) not found",
            status: false,
        } as IClientResponse);

    const foundedFriend = await User.findOne({ username: req.body.ofu });

    if (!foundedFriend)
        return res.json({
            message: "Username friend username (ofu) not valid",
            status: false,
        } as IClientResponse);

    const userFoundRoomUser = await RoomUser.find({ idUser: foundedUser._id });
    const friendFoundRoomUser = await RoomUser.find({
        idUser: foundedFriend._id,
    });

    let foundRoom: IRoom | null;

    if (friendFoundRoomUser.length === 0 || userFoundRoomUser.length === 0) {
        foundRoom = await createRoom(foundedUser._id, foundedFriend._id);
    } else {
        let lastUserId: string = "";
        let found: boolean = false;

        loopMain: for (let i = 0; i < userFoundRoomUser.length; i++) {
            lastUserId = userFoundRoomUser[i].idRoom.toString();
            for (let i = 0; i < friendFoundRoomUser.length; i++) {
                if (friendFoundRoomUser[i].idRoom.toString() === lastUserId) {
                    console.log("Room found");
                    found = true;
                    break loopMain;
                }
            }
        }

        if (found) {
            foundRoom = await Room.findById(lastUserId);
        } else {
            foundRoom = await createRoom(foundedUser._id, foundedFriend._id);
        }
    }

    if (!foundRoom)
        return res.json({
            message: "Room not found after creaing it",
            status: false,
        } as IClientResponse);

    return res.json({
        message: "Room found",
        status: true,
        room: foundRoom._id,
    } as IClientResponse);
}

export async function deleteRoom(
    req: Request,
    res: Response
): Promise<Response> {
    return res.json({ message: "Yes", status: false } as IClientResponse);
}
