import {model, Schema, Document} from 'mongoose';

export interface IRoomType extends Document {
    type: string;
}

const roomTypeSchema = new Schema({
    type: {
        type: String,
        required: true,
        trim: true
    }
});

export default model<IRoomType>('RoomType', roomTypeSchema);