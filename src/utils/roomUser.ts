import RoomUser, { IRoomUser } from "../models/RoomUser";
import { Schema } from "mongoose";

export async function getRoomIdFromTwoUsers(
    idUser1: string,
    idUser2: string
): Promise<Schema.Types.ObjectId | undefined> {
    const roomUser1: IRoomUser[] = await RoomUser.find({ idUser: idUser1 });
    const roomUser2: IRoomUser[] = await RoomUser.find({ idUser: idUser2 });

    if (roomUser1.length === 0 || roomUser2.length === 0) return undefined;

    roomUser1.map((roomUser, index) => {
        if (roomUser.idRoom.toString() === roomUser2[index].idRoom.toString()) {
            return roomUser.idRoom;
        }
    });

    return undefined;
}
