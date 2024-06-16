import express from 'express';
import dotenv from 'dotenv';

import connectDB from './config/database';
import sessionConfig from './config/session';
import corsConfig from './config/cors';

import authRouter from './modules/auth/router';
import userRouter from './modules/user/routes';

dotenv.config();

const serve = async () => {
    try {
        await connectDB();

        // Initialize Express app
        const app = express();
        app.use(express.json(), express.urlencoded({ extended: true }));

        corsConfig(app);
        sessionConfig(app);

        app.use('/api', authRouter);
        app.use('/api/users', userRouter);

        app.get('*', (req, res) => {
            return res.redirect(process.env.APP_FRONTEND_HOST as string);
        });

        const port = process.env.APP_PORT || 3000;

        app.listen(port, () => {
            console.log(`App running in development on port ${port}`);
        });
    } catch (error) {
        console.log('Error starting the server:', error);
    }
};

serve();
