import RoomType from '../models/RoomType';
import MessageType from '../models/MessageType';

export async function createRoomTypes() {
    const documents = await RoomType.estimatedDocumentCount();

    if(documents > 0){
        return;
    }

    const values = await Promise.all([
        new RoomType({type: "private"}).save(),
        new RoomType({type: "group"}).save()
    ]);

    console.log(values);
}

export async function createMessageTypes() {
    const documents = await MessageType.estimatedDocumentCount();

    if(documents > 0){
        return;
    }

    const values = await Promise.all([
        new MessageType({type: "message"}).save(),
        new MessageType({type: "audio"}).save(),
        new MessageType({type: "image"}).save(),
        new MessageType({type: "video"}).save(),
    ]);
}