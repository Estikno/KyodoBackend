import Message, { IMessage } from "../models/Message";
import Room, { IRoom } from "../models/Room";
import RoomUser, { IRoomUser } from "../models/RoomUser";
import User, { IUser } from "../models/User";

export async function createMessage(
    idUser: string,
    message: string,
    username: string,
    username_to: string,
    id_room: string
): Promise<IMessage | undefined> {
    //view the room, roomType and roomUser exists
    const user_to = await User.findOne({ username: username_to });

    let defIdRoom: string = id_room;

    if (!user_to) return undefined;
    
    if(id_room === "1"){
        const newRoom = new Room({ idType: "63d6c6f6c3f41b356dab2fd1" });
        
        console.log("no room created")
        await newRoom.save();

        await new RoomUser({ idUser: idUser, idRoom: newRoom.id }).save();
        await new RoomUser({ idUser: user_to._id, idRoom: newRoom.id }).save();

        const newMessage = new Message({
            idUser: idUser,
            idRoom: newRoom.id,
            username: username,
            message: message,
        });
        await newMessage.save();
        return newMessage;
    }

    const roomUser1 = await RoomUser.findOne({
        idUser: idUser,
        idRoom: id_room,
    });
    const roomUser2 = await RoomUser.findOne({
        idUser: user_to._id,
        idRoom: id_room,
    });

    if (!roomUser1 && !roomUser2) {
        //no room created
        const newRoom = new Room({ idType: "63d6c6f6c3f41b356dab2fd1" });
        await newRoom.save();

        await new RoomUser({ idUser: idUser, idRoom: newRoom.id }).save();
        await new RoomUser({ idUser: user_to._id, idRoom: newRoom.id }).save();

        defIdRoom = newRoom._id;
    } else if (!roomUser1) {
        await new RoomUser({ idUser: idUser, idRoom: id_room }).save();
    } else if (!roomUser2) {
        await new RoomUser({ idUser: user_to._id, idRoom: id_room }).save();
    }

    const newMessage = new Message({
        idUser: idUser,
        idRoom: defIdRoom,
        username: username,
        message: message,
    });
    await newMessage.save();
    return newMessage;
}

export async function getMessages(): Promise<IMessage[]> {
    return await Message.find();
}
