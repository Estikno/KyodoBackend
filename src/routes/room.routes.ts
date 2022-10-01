import {Router} from 'express';
import * as roomController from '../controllers/room.controller';

import {verifyToken} from '../middlewares/authJwt';

const router = Router();

/**
 * !The routes are already prefixed with /room
 * !Do not create the functions here, create them in the controller file
 */
router.post('/', verifyToken, roomController.getRoom);

router.delete('/', verifyToken, roomController.deleteRoom);

export default router;