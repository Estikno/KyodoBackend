import {Schema, model, Document} from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    username: string;
    password: string;
    email: string;
    avatarImage: {
        isAvatarImageSet: boolean;
        avatarImageUrl: string;
        avatarImagePublicId: string;
    }
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema({
    //set the username min length to 3 and max length to 20
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20
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
    },
    avatarImage: {
        isAvatarImageSet: {
            type: Boolean,
            default: false
        },
        avatarImageUrl: {
            type: String,
            default: ""
        },
        avatarImagePublicId: {
            type: String,
            default: ""
        }
    }
},
{
    timestamps: true,
    versionKey: false
});

/**
 * Excecutes when a new value is set on the table, is secures the password
 * TODO: Move this function to another script and call it from here
 */
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

userSchema.methods.hashPassword = async function(): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);

    this.password = hash;
}

/**
 * Compare the password with the hashed one and return true or false if they match
 * TODO: Move this function to another script and call it from here
 */
userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

export default model<IUser>('User', userSchema);