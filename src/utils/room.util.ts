import Room, {IRoom} from '../models/Room';
import RoomUser, {IRoomUser} from '../models/RoomUser';

export async function createRoom(user_id: any, friend_id: any): Promise<IRoom> {
    const newRoom = new Room();
    await newRoom.save();

    const userRoomUser = new RoomUser({idUser: user_id, idRoom: newRoom._id});
    const friendRoomUser = new RoomUser({idUser: friend_id, idRoom: newRoom._id});

    await userRoomUser.save();
    await friendRoomUser.save();

    return newRoom;
}