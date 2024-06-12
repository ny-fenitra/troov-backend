import { Router } from 'express';

import loginController, { loginValidator } from './controllers/loginController';
import registerController, { registerValidator } from './controllers/registerController';
import logoutController from './controllers/logoutController';

const authRouter = Router();

authRouter
    .post('/login', loginValidator, loginController)
    .post('/register', registerValidator, registerController)
    .post('/logout', logoutController);

export default authRouter;
