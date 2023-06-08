import RoomUser, { IRoomUser } from "../models/RoomUser";
import { Schema } from "mongoose";

/**
 * Gets the room's id from two id of users
 * @param idUser1 id of the first user
 * @param idUser2 if of the second user
 * @returns The id of the room, if there is no room returns undefined
 */
export async function getRoomIdFromTwoUsers(
    idUser1: string,
    idUser2: string
): Promise<string> {
    const roomUser1: IRoomUser[] = await RoomUser.find({ idUser: idUser1 });
    const roomUser2: IRoomUser[] = await RoomUser.find({ idUser: idUser2 });

    let _id: string = "";

    if (roomUser1.length === 0 || roomUser2.length === 0) return _id;

    roomUser1.map((roomUser) => {
        roomUser2.map((anotherRoomUser) => {
            if(roomUser.idRoom.toString() === anotherRoomUser.idRoom.toString()){
                _id = roomUser.idRoom.toString();
            }
        });
    });

    roomUser2.map((roomUser) => {
        roomUser1.map((anotherRoomUser) => {
            if(roomUser.idRoom.toString() === anotherRoomUser.idRoom.toString()){
                _id = roomUser.idRoom.toString();
            }
        });
    });

    return _id;
}
