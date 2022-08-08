import {model, Schema, Document} from 'mongoose';

export interface IRoomType extends Document {
    id: number;
    type: string;
}

const roomTypeSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    }
});

export default model<IRoomType>('RoomType', roomTypeSchema);