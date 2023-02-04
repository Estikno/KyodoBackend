import RoomType, { IRoomType } from "../models/RoomType";

export default async function () {
    const allRoomTypes = await RoomType.find();

    if(allRoomTypes.length > 0) return;

    const newType: IRoomType = new RoomType({ type: "private" });
    const newType1: IRoomType = new RoomType({ type: "public" });

    await newType.save();
    await newType1.save();
}
