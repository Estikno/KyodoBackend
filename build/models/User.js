"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../config"));
const bcrypt_2 = require("../utils/bcrypt");
const userSchema = new mongoose_1.Schema({
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
        avatarImageUrl: {
            type: String,
            default: config_1.default.DEFAULT_AVATAR_URL
        },
        avatarImagePublicId: {
            type: String,
            default: ""
        }
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});
/**
 * Excecutes when a new value is set on the table, is secures the password
 * TODO: Move this function to another script and call it from here
 */
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        //if the password is not modified, do not hash it
        if (!user.isModified('password'))
            return next();
        //encrypt the password and replace the password with the hashed one
        user.password = yield (0, bcrypt_2.encrypt)(user.password);
        next();
    });
});
userSchema.methods.hashPassword = function () {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = yield (0, bcrypt_2.encrypt)(this.password);
    });
};
/**
 * Compare the password with the hashed one and return true or false if they match
 * TODO: Move this function to another script and call it from here
 */
userSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.password);
    });
};
exports.default = (0, mongoose_1.model)('User', userSchema);
