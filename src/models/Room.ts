import { Schema, model, Document } from "mongoose";
import config from "../config";

export interface IRoom extends Document {
    idType: Schema.Types.ObjectId;
}

const roomSchema = new Schema(
    {
        idType: {
            type: Schema.Types.ObjectId,
            require: true,
            ref: "RoomType",
        },
    },
    { timestamps: true, versionKey: false }
);

export default model<IRoom>("Room", roomSchema);
