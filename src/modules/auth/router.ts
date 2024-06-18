import { Router } from 'express';

import loginController, { loginValidator } from './controllers/loginController';
import registerController, { registerValidator } from './controllers/registerController';
import logoutController from './controllers/logoutController';
import meController from './controllers/meController';

import guard from '../../shared/middlewares/guard';

const authRouter = Router();

authRouter
    .post('/login', loginValidator, loginController)
    .post('/register', registerValidator, registerController)
    .post('/logout', logoutController)
    .get('/me', guard, meController);

export default authRouter;
