import {Schema, model, Document} from 'mongoose';
import config from '../config';

export interface IRoomUser extends Document {
    idUser: Schema.Types.ObjectId;
    idRoom: Schema.Types.ObjectId;
}

const RoomUserSchema = new Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    idRoom: {
        type: Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    }
},{
    timestamps: true,
    versionKey: false
});

export default model<IRoomUser>('RoomUser', RoomUserSchema);