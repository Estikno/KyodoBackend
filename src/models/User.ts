import {Schema, model, Document} from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    username: string;
    password: string;
    email: string;
}

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    }
},
{
    timestamps: true,
    versionKey: false
});

//excecutes when a new value is set on the table
userSchema.pre<IUser>('save', async function(next) {
    const user = this;

    //if the password is not modified, do not hash it
    if(!user.isModified('password')) return next();

    //encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    //replace the password with the hashed one
    user.password = hash;

    next();
});

//compare the password with the hashed one and return true or false if they match
userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

export default model<IUser>('User', userSchema);