import {Router} from 'express';
import * as userController from '../controllers/user.controller';

const router = Router();

/**
 * !The routes are already prefixed with /user
 * !Do not create the functins here, create them in the controller file
 */
router.get('/', userController.getUsers);

router.post('/', userController.createUser);

router.get('/:id', userController.getUser);

router.delete('/:id', userController.deleteUser);

export default router;