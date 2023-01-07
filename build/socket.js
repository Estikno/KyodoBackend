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
exports.io_setup = void 0;
const User_1 = __importDefault(require("./models/User"));
const message_util_1 = require("./utils/message.util");
function io_setup(io) {
    return __awaiter(this, void 0, void 0, function* () {
        const connectedUsers = new Map();
        io.on("connection", (socket) => {
            socket.on("add-user", (user) => __awaiter(this, void 0, void 0, function* () {
                const newUser = yield User_1.default.findOne({ username: user });
                const allMessages = (yield (0, message_util_1.getMessages)()).map((each) => each.message);
                socket.emit("all-msg", allMessages);
                if (connectedUsers.get(user))
                    return;
                if (!newUser)
                    return;
                connectedUsers.set(user, socket.id);
                const newUserResponse = {
                    avatarUrl: newUser.avatarImage.avatarImageUrl,
                    email: newUser.email,
                    username: newUser.username,
                    verified: newUser.verified,
                };
                socket.broadcast.emit("new-usr", newUserResponse);
            }));
            socket.on("send-msg", (msg) => __awaiter(this, void 0, void 0, function* () {
                const foundUser = yield User_1.default.findOne({ username: msg.person });
                if (foundUser) {
                    yield (0, message_util_1.createMessage)(foundUser._id, msg.message);
                    io.emit("msg", { message: msg.message, username: msg.person });
                }
            }));
        });
    });
}
exports.io_setup = io_setup;
