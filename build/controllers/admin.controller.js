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
exports.getToken = exports.banUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
const config_1 = __importDefault(require("../config"));
const profile_controller_1 = require("../controllers/profile.controller");
const user_controller_1 = require("../controllers/user.controller");
function banUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const password = req.body.user_id;
        const userBan = req.body.banUser;
        if (!userBan)
            return res.json({ message: "The user to ban is not found", status: false });
        if (password !== config_1.default.ADMIN_PASSWORD)
            return res.json({ message: "Password is incorrect", status: false });
        const user = yield User_1.default.findOne({ username: userBan });
        if (!user)
            return res.json({ message: "User not found", status: false });
        req.body.user_id = user._id;
        yield (0, profile_controller_1.removeAvatar)(req, res);
        yield (0, user_controller_1.deleteUser)(req, res);
        return res.json({ message: "User has been banned", status: true });
    });
}
exports.banUser = banUser;
function getToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const password = req.params.password;
        if (password !== config_1.default.ADMIN_PASSWORD)
            return res.json({ message: "Invalid password", status: false });
        const token = (0, jwt_1.createToken)(password);
        return res.json({ message: "Token created", status: true, token: token });
    });
}
exports.getToken = getToken;
