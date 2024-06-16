import { Application } from 'express';
import session from 'express-session';

import { User } from '../shared/models/UserModel';

declare module 'express-session' {
    export interface SessionData {
        userAttempt: number;
        user: User;
        accessToken: string;
    }
}

export default (app: Application) => {
    const sessionMiddleware = session({
        secret: process.env.SECRET_SESSION as string,
        resave: true,
        saveUninitialized: false,
        cookie: {
            httpOnly: ['production', 'staging'].includes(process.env.APP_ENV as string) ? true : false,
            secure: ['production', 'staging'].includes(process.env.APP_ENV as string) ? true : false,
            ...(['production', 'staging'].includes(process.env.APP_ENV as string)
                ? { domain: process.env.DOMAIN }
                : {}),
            ...(process.env.APP_ENV === 'staging' ? { sameSite: 'none' } : { sameSite: 'strict' }),
        },
    });

    app.use(sessionMiddleware);
};
