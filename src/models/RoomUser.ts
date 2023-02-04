import { Schema, model, Document } from "mongoose";

export interface IRoomUser extends Document {
    idUser: Schema.Types.ObjectId;
    idRoom: Schema.Types.ObjectId;
}

const RoomUserSchema = new Schema(
    {
        idUser: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        idRoom: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Room",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default model<IRoomUser>("RoomUser", RoomUserSchema);
