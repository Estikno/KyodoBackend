"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./config"));
//routes
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
class App {
    //TODO: Call all the config and routes methods, and also make that methods private
    constructor() {
        this.app = (0, express_1.default)();
        /*this.config();
    this.routes();*/
    }
    config() {
        this.app.set("port", config_1.default.PORT);
        this.app.use((0, morgan_1.default)("dev"));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    //* Impotant to add the routes here, otherwise the routes will not be available, and also set the prefix for the routes
    routes() {
        this.app.use("/user", user_routes_1.default);
        this.app.use("/auth", auth_routes_1.default);
        this.app.use("/profile", profile_routes_1.default);
        this.app.use("/admin", admin_routes_1.default);
    }
    listen(httpServer) {
        httpServer.listen(this.app.get("port"), () => {
            console.log("Server on port", this.app.get("port"));
        });
    }
    getServer() {
        return this.app;
    }
}
exports.default = App;
