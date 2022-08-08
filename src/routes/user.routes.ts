import {Router} from 'express';
import * as userController from '../controllers/user.controller';

const router = Router();

/**
 * !The routes are already prefixed with /user
 * !Do not create the functions here, create them in the controller file
 */
router.get('/', userController.getUsers);

router.post('/', userController.createUser);

router.get('/:id', userController.getUser);

router.delete('/:id', userController.deleteUser);

router.put('/:id', userController.updateUser);

export default router;