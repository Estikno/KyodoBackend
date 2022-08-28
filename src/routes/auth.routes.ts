import {Router} from 'express';
import * as authController from '../controllers/auth.controller';

import {verifyBeforeAuth} from '../middlewares/authJwt';

const router = Router();

/**
 * !The routes are already prefixed with /auth
 * !Do not create the functions here, create them in the controller file
 */

router.post('/register', verifyBeforeAuth, authController.register);

router.post('/login', verifyBeforeAuth, authController.login);

export default router;