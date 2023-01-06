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
exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
/**
 * Get all users
 */
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body.user_id) {
            return res.json({ message: "User id not found", status: false });
        }
        const user_id = req.body.user_id;
        const actualUser = yield User_1.default.findById(user_id);
        if (!actualUser) {
            return res.json({ message: "User not verified", status: false });
        }
        const allUsers = yield User_1.default.find();
        const returningUsers = [];
        allUsers.forEach((user) => {
            if (user.username !== actualUser.username) {
                returningUsers.push({
                    username: user.username,
                    email: user.email,
                    avatarUrl: user.avatarImage.avatarImageUrl,
                    verified: user.verified
                });
            }
        });
        return res.json({ message: "All user", status: true, user: returningUsers });
    });
}
exports.getUsers = getUsers;
/**
 * Get user by id
 */
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body.user_id) {
            return res.json({
                message: "An error occurred, please try again later",
                status: false
            });
        }
        const foundUser = yield User_1.default.findById(req.body.user_id);
        if (!foundUser) {
            return res.json({ message: "User not found", status: false });
        }
        const checkedUser = {
            username: foundUser.username,
            email: foundUser.email,
            avatarUrl: foundUser.avatarImage.avatarImageUrl,
            verified: foundUser.verified
        };
        return res.json({ user: checkedUser, message: "User found", status: true });
    });
}
exports.getUser = getUser;
/**
 * Updates a user with the information passed, the update info has to be in the body in a "updateInfo" param
 * * Do not use this method to update the avatar or the password, these functions are already working in other special routes
 */
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body.user_id) {
            return res.json({ message: "User id not found", status: false });
        }
        if (!req.body.updateInfo) {
            return res.json({ message: "The body is missing", status: false });
        }
        const foundUser = yield User_1.default.findById(req.body.user_id);
        if (!foundUser) {
            return res.json({ message: "User not found", status: false });
        }
        yield User_1.default.findByIdAndUpdate(req.body.user_id, req.body.updateInfo);
        return res.json({ message: "User updated", status: true });
    });
}
exports.updateUser = updateUser;
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body.user_id) {
            return res.json({ message: "Id not provided", status: false });
        }
        const foundUser = yield User_1.default.findById(req.body.user_id);
        if (!foundUser) {
            return res.json({ message: "User not found", status: false });
        }
        yield User_1.default.findByIdAndDelete(req.body.user_id);
        return res.json({ message: "User deleted", status: true });
    });
}
exports.deleteUser = deleteUser;
