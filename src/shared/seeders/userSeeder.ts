import { RoleEnum } from '../utils/enums';

import UserModel from '../models/UserModel';
import { error } from 'console';

export default async () => {
    console.log('Begin user seeder');

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        throw error('Missing ADMIN_EMAIL or ADMIN_PASSWORD environment variable');
    }

    const adminUser = {
        firstname: 'Admin',
        lastname: 'Admin',
        email: adminEmail,
        password: adminPassword,
        role: RoleEnum.ADMIN,
    };

    await UserModel.deleteMany(); // Clear existing items

    const user = new UserModel(adminUser);
    await user.save();

    console.log('User seeded successfully');
};
