import {Router} from 'express';
import * as adminController from '../controllers/admin.controller';
import {verifyToken} from '../middlewares/authJwt';

const router = Router();

/**
 * !The routes have already an "/admin" prefix, so it's not necessary to add it here
 */
router.post('/banUser', verifyToken, adminController.banUser);

router.get('/:password', adminController.getToken);

export default router;