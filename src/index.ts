import express from 'express';
import dotenv from 'dotenv';

import connectDB from './config/database';

dotenv.config();

const serve = async () => {
    try {
        await connectDB();

        // Initialize Express app
        const app = express();

        app.use(express.json());

        app.get('*', (req, res) => {
            res.send('Hello World');
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
