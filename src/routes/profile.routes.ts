import { Router } from "express";
import fileUpload from "express-fileupload";
import * as profileController from "../controllers/profile.controller";

import {verifyToken} from '../middlewares/authJwt';

const router = Router();

/**
 * !The routes are already prefixed with /profile
 * !Do not create the functions here, create them in the controller file
 */

router.post(
    "/avatar",
    verifyToken,
    fileUpload({
        useTempFiles: true,
        tempFileDir: "./uploads",
    }),
    profileController.changeAvatar
);

router.delete("/avatar", verifyToken, profileController.removeAvatar);

router.put("/password", verifyToken, profileController.changePassword);

export default router;
