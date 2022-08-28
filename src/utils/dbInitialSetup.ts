import RoomType from '../models/RoomType';

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