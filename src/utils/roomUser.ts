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
): Promise<Schema.Types.ObjectId | undefined> {
    const roomUser1: IRoomUser[] = await RoomUser.find({ idUser: idUser1 });
    const roomUser2: IRoomUser[] = await RoomUser.find({ idUser: idUser2 });

    if (roomUser1.length === 0 || roomUser2.length === 0) return undefined;

    /*roomUser1.map((roomUser, index) => {
        if (roomUser.idRoom.toString() === roomUser2[index].idRoom.toString()) {
            return roomUser.idRoom;
        }
    });*/

    for (let index = 0; index < roomUser1.length; index++) {
        if (roomUser1[index].idRoom.toString() === roomUser2[index].idRoom.toString()) {
            return roomUser1[index].idRoom;
        }
    }

    return undefined;
}
