import {Router} from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

/**
 * !The routes are already prefixed with /auth
 * !Do not create the functions here, create them in the controller file
 */

router.post('/register', authController.register);

//router.post('/login', authController.login);

export default router;