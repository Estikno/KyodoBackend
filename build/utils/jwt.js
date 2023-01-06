"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenContent = exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
function createToken(user_id) {
    const token = jsonwebtoken_1.default.sign({ id: user_id }, config_1.default.JWT_SECRET, {
        expiresIn: config_1.default.JWT_DURATION,
    });
    return token;
}
exports.createToken = createToken;
function verifyToken(token) {
    try {
        jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET); //the decoded token will be an _id of an user or an
        return true;
    }
    catch (error) {
        return false;
    }
}
exports.verifyToken = verifyToken;
function getTokenContent(token) {
    const { id } = jsonwebtoken_1.default.decode(token);
    return id;
}
exports.getTokenContent = getTokenContent;
