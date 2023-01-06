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
exports.removeAvatar = exports.changePassword = exports.changeAvatar = void 0;
const cloudinary_1 = require("../utils/cloudinary");
const fs_extra_1 = __importDefault(require("fs-extra"));
const User_1 = __importDefault(require("../models/User"));
const config_1 = __importDefault(require("../config"));
function changeAvatar(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body.user_id) {
            return res.json({
                message: "No user id provided",
                status: false,
            });
        }
        const beforeUser = (yield User_1.default.findById(req.body.user_id));
        if (!beforeUser) {
            return res.json({
                message: "User not found",
                status: false,
            });
        }
        if (!((_a = req.files) === null || _a === void 0 ? void 0 : _a.image)) {
            return res.json({
                message: "No image provided",
                status: false,
            });
        }
        const image = req.files.image;
        const options = {
            folder: "kyodo/avatars",
            aspect_ratio: "1:1",
            gravity: "auto",
            opacity: 100,
            radius: "max",
            width: 300,
            crop: "fill",
            format: "png",
        };
        const result = yield (0, cloudinary_1.uploadImage)(image.tempFilePath, options);
        yield fs_extra_1.default.unlink(image.tempFilePath);
        if (!(beforeUser.avatarImage.avatarImagePublicId === "")) {
            yield (0, cloudinary_1.deleteImage)(beforeUser.avatarImage.avatarImagePublicId);
        }
        yield User_1.default.findByIdAndUpdate(req.body.user_id, {
            avatarImage: {
                avatarImageUrl: result.secure_url,
                avatarImagePublicId: result.public_id,
            },
        }, { new: true });
        return res.json({
            message: "Image uploaded successfully. Reload the page to see the changes",
            status: true,
        });
    });
}
exports.changeAvatar = changeAvatar;
function changePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const passwords = req.body;
        if (!passwords.oldPassword || !passwords.newPassword) {
            return res.json({
                message: "Missing passwords",
                status: false,
            });
        }
        const founduser = yield User_1.default.findById(req.body.user_id);
        if (!founduser) {
            return res.json({
                message: "User not found",
                status: false,
            });
        }
        if (!(yield founduser.comparePassword(passwords.oldPassword))) {
            return res.json({
                message: "Old password is incorrect",
                status: false,
            });
        }
        founduser.password = passwords.newPassword;
        const user = yield founduser.save();
        return res.json({
            status: true,
            message: "Password changed",
        });
    });
}
exports.changePassword = changePassword;
function removeAvatar(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body.user_id) {
            return res.json({
                message: "No user id provided",
                status: false,
            });
        }
        const foundUser = yield User_1.default.findById(req.body.user_id);
        if (!foundUser) {
            return res.json({
                message: "User not found",
                status: false,
            });
        }
        //the user is already with the default avatar
        if (foundUser.avatarImage.avatarImagePublicId === "") {
            return res.json({
                message: "Already with the default avatar",
                status: false,
            });
        }
        yield (0, cloudinary_1.deleteImage)(foundUser.avatarImage.avatarImagePublicId);
        if (!config_1.default.DEFAULT_AVATAR_URL)
            return res.json({
                message: "Default avatar url is not set",
                status: false,
            });
        foundUser.avatarImage = {
            avatarImageUrl: config_1.default.DEFAULT_AVATAR_URL,
            avatarImagePublicId: "",
        };
        foundUser.save();
        return res.json({
            message: "Avatar removed successfully",
            status: true,
        });
    });
}
exports.removeAvatar = removeAvatar;
