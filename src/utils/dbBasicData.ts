import RoomType, { IRoomType } from "../models/RoomType";

/**
 * This function creates two new room types ("private" and "public") in a database collection called RoomType, but only if there are no existing room types in the collection.
 */
export default async function () {
    const allRoomTypes = await RoomType.find();

    if(allRoomTypes.length > 0) return;

    const newType: IRoomType = new RoomType({ type: "private" });
    const newType1: IRoomType = new RoomType({ type: "public" });

    await newType.save();
    await newType1.save();
}
