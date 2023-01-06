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
exports.verifiedUser = exports.verification = exports.verifySession = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
const email_1 = require("../utils/email");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
/**
 * This function registers the user and creates a new user in the database
 */
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.json({
                message: 'Missing fields',
                status: false
            });
        }
        const userCheck = yield User_1.default.findOne({ username: username });
        const emailCheck = yield User_1.default.findOne({ email: email });
        if (userCheck || emailCheck) {
            return res.json({
                message: 'User already exists. Email or passowrd is repeated',
                status: false
            });
        }
        const newUser = new User_1.default({ username, password, email });
        yield newUser.save();
        const token = (0, jwt_1.createToken)(newUser._id);
        //email verification
        const verification_token = (0, jwt_1.createToken)(newUser.username);
        (0, email_1.sendVerificationEmail)(newUser.email, `http://localhost:3000/email-confirm/${verification_token}`, newUser.username);
        return res.json({ message: 'User created', status: true, token: token });
    });
}
exports.register = register;
/**
 * This function logs the user in and returns the user if the credentials are correct
 */
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.json({
                message: 'Missing fields',
                status: false
            });
        }
        const userCheck = yield User_1.default.findOne({ username: username });
        if (!userCheck) {
            return res.json({
                message: 'Incorrect username or password',
                status: false
            });
        }
        const isPasswordCorrect = yield userCheck.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.json({
                message: 'Incorrect username or password',
                status: false
            });
        }
        const token = (0, jwt_1.createToken)(userCheck._id);
        return res.json({ message: 'Logged in', status: true, token: token });
    });
}
exports.login = login;
function verifySession(req, res) {
    const token = req.headers["token"];
    if (!token || token === "")
        return res.json({ message: "Token is necessary", status: false });
    return res.json({ message: "Token verified", status: (0, jwt_1.verifyToken)(token) });
}
exports.verifySession = verifySession;
function verification(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.params.token;
        try {
            const { id } = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
            yield User_1.default.findOneAndUpdate({ username: id }, { verified: true });
            return res.json({ message: "Token verified", status: true });
        }
        catch (err) {
            return res.json({ message: "Token is invalid", status: false });
        }
    });
}
exports.verification = verification;
function verifiedUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user_id = req.body.user_id;
        const _user = yield User_1.default.findById(user_id);
        if (!_user)
            return res.json({ message: "User not found", status: false });
        return res.json({ message: "User verified", status: true, user: { verified: _user.verified } });
    });
}
exports.verifiedUser = verifiedUser;
