import {Schema, model, Document} from 'mongoose';
import config from '../config';

export interface IRoom extends Document {
    idType: Schema.Types.ObjectId;
}

const RoomSchema = new Schema({
    idType: {
        type: Schema.Types.ObjectId,
        ref: "RoomType",
        default: "630b24b0b4b1498dd203813e"
    }
},{
    timestamps: true,
    versionKey: false
});

export default model<IRoom>('Room', RoomSchema);