"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jwt_1 = require("../utils/jwt");
function verifyToken(req, res, next) {
    const token = req.headers["token"];
    if (!token) {
        return res.json({ message: "No token provided", status: false });
    }
    if (!(0, jwt_1.verifyToken)(token))
        return res.json({ message: "Invalid token", status: false });
    req.body.user_id = (0, jwt_1.getTokenContent)(token);
    next();
    /*try {
        const decoded = jwt.verify(token, config.JWT_SECRET as string) as IJwt; //the decoded token will be an _id of an user
        req.body.user_id = decoded.id;

        next();
    } catch (error) {
        return res.json({ message: "Invalid token", status: false });
    }*/
}
exports.verifyToken = verifyToken;
