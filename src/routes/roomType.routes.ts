import {Router} from 'express';
import * as roomTypeController from '../controllers/roomType.controller';

const router = Router();

/**
 * !The routes are already prefixed with /roomType
 * !Do not create the functions here, create them in the controller file
 */

router.get('/:id', roomTypeController.getRoomType);

export default router;