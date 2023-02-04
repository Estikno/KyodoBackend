import { Schema, model, Document } from "mongoose";
import config from "../config";

export interface IRoomType extends Document {
    type: string;
}

const roomTypeSchema = new Schema({
    type: {
        type: String,
    },
}, {versionKey: false});

export default model<IRoomType>("RoomType", roomTypeSchema);
