import dotenv from 'dotenv';

import connectDB from '../config/database';
import userSeeder from '../shared/seeders/userSeeder';

dotenv.config();

const seeder = async () => {
    const dbInstance = await connectDB();

    // Run seeds
    try {
        await userSeeder();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }

    // Disconnect from database
    dbInstance.disconnect();
};

seeder();
