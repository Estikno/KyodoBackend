import { Schema, model, Document } from "mongoose";

export interface IMessage extends Document {
    idUser: Schema.Types.ObjectId;
    idRoom: Schema.Types.ObjectId;
    username: string;
    message: string;
}


const MessageSchema = new Schema(
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
        username: {
            type: String,
            require: true
        },
        message: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default model<IMessage>("Message", MessageSchema);