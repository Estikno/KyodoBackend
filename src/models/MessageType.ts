import { Schema, model, Document } from "mongoose";

export interface IMessageType extends Document {
    type: string;
}

const MessageTypeSchema = new Schema(
    {
        type: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        versionKey: false,
    }
);

export default model<IMessageType>("MessageType", MessageTypeSchema);
