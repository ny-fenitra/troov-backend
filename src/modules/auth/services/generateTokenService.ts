import { Request } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../../../shared/models/UserModel';

export const generateAccessToken = (req: Request, user: User) => {
    return new Promise<string | undefined>((resolve, reject) => {
        jwt.sign(
            { user: user },
            process.env.SECRET_ACCESS_TOKEN as string,
            { expiresIn: '1h' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            async (error: any, accessToken: string | undefined) => {
                if (error) {
                    reject(error);
                }

                req.session.accessToken = accessToken;
                req.session.user = user;
                req.session.userAttempt = 0;

                resolve(accessToken);
            },
        );
    });
};
