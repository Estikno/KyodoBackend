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
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //TODO: Add to the config the user and password for the mongo db
            const options = {
                auth: {
                    username: config_1.default.MONGO_USER,
                    password: config_1.default.MONGO_PASSWORD
                },
                authSource: "admin"
            };
            mongoose_1.default.set('strictQuery', true);
            const db = yield mongoose_1.default.connect(`mongodb://${config_1.default.MONGO_HOST}:${config_1.default.MONGO_PORT}/${config_1.default.MONGO_DATABASE}`, options);
            console.log(`Database connected: ${db.connection.name}`);
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.connectDB = connectDB;
