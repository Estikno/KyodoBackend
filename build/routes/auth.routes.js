"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController = __importStar(require("../controllers/auth.controller"));
const authJwt_1 = require("../middlewares/authJwt");
const router = (0, express_1.Router)();
/**
 * !The routes are already prefixed with /auth
 * !Do not create the functions here, create them in the controller file
 */
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verification/:token', authController.verification);
router.get('/verifiedUser', authJwt_1.verifyToken, authController.verifiedUser);
/**
 * this route will be called by the client whenever the user is trying to go to a protected route
 * This route will only see if the token is valid
 */
router.get('/verify', authController.verifySession);
exports.default = router;
