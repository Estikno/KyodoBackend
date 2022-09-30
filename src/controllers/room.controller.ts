import { Request, Response } from "express";
import IClientResponse from "../interfaces/IClientResponse";
import Room, { IRoom } from "../models/Room";
import User, { IUser } from "../models/User";
import RoomUser, { IRoomUser } from "../models/RoomUser";

export async function getRoom(req: Request, res: Response): Promise<Response> {
    if(!req.body.user_id) return res.json({message: "User id not found", status: false} as IClientResponse);

    const user_id = req.body.user_id;
    const foundedUser = await User.findById(user_id);

    if(!foundedUser) return res.json({message: "User not found", status: false} as IClientResponse);
    if(!req.body.ofu) return res.json({message: "User friend (ofu) not found", status: false} as IClientResponse);

    const foundedFriend = await User.findOne({username: req.body.ofu});

    if(!foundedFriend) return res.json({message: "User friend username (ofu) not valid", status: false} as IClientResponse);

    const userFoundRoomUser = await RoomUser.find({idUser: foundedUser._id});
    const friendFoundRoomUser = await RoomUser.find({idUser: foundedFriend._id});

    //! If the room is not found just create a new room in another script

    let lastUserId;
    let found: boolean = false;

    mainLoop: for(let i = 0; i < userFoundRoomUser.length, i++;){
        lastUserId = userFoundRoomUser[i]._id;

        for(let i = 0; i < friendFoundRoomUser.length, i++;){
            if(friendFoundRoomUser[i]._id === lastUserId){
                found = true;
                continue mainLoop;
            }
        }
    }

    const foundRoom = await Room.findById(lastUserId);

    //! If the room is not found just create a new room in another script

    return res.json({message: "Room found", status: true} as IClientResponse);
}

export async function deleteRoom(req: Request, res: Response): Promise<Response> {
    return res.json({message: "Yes", status: false} as IClientResponse);
}