import {Router} from 'express';
import * as authController from '../controllers/auth.controller';
import {verifyToken} from '../middlewares/authJwt';

const router = Router();

/**
 * !The routes are already prefixed with /auth
 * !Do not create the functions here, create them in the controller file
 */

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/verification/:token', authController.verification);

router.get('/verifiedUser', verifyToken, authController.verifiedUser);

/**
 * this route will be called by the client whenever the user is trying to go to a protected route
 * This route will only see if the token is valid
 * !Do not use this route in production, is deprecated
 */
router.get('/verify', authController.verifySession);

export default router;