import { Router } from 'express';

import userController, { createUserValidator, updateUserValidator } from './controllers/userController';

import guard from '../../shared/middlewares/guard';
import admin from '../../shared/middlewares/admin';

const userRouter = Router();

userRouter
    .use(guard)
    .use(admin)
    .get('/', userController.getItems)
    .get('/:id', userController.getItemById)
    .post('/', createUserValidator, userController.createItem)
    .put('/:id', updateUserValidator, userController.updateItem)
    .delete('/:id', userController.deleteItem);

export default userRouter;
