import { Schema, model, Document } from "mongoose";

export interface IMessage extends Document {
    idUser: Schema.Types.ObjectId;
    message: string;
}

const MessageSchema = new Schema(
    {
        idUser: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
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