import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import UserModel from '../../../shared/models/UserModel';
import { generateAccessToken } from '../services/generateTokenService';

export const loginValidator = [
    body('email').isEmail().withMessage('Email must be valid').notEmpty().withMessage('Email is required').escape(),
    body('password').trim().notEmpty().withMessage('Password is required').escape(),
];

export default async (req: Request, res: Response) => {
    req.session.userAttempt = typeof req.session.userAttempt !== 'number' ? 0 : req.session.userAttempt;

    if (req.session.userAttempt >= 3) {
        res.status(400).json({ msg: 'The 3 attempts have expired, please wait a few minutes!' });
        return;
    }

    const validation = validationResult(req);

    if (validation.isEmpty()) {
        try {
            const user = await UserModel.findOne({ email: req.body.email }).select('+password');

            if (user) {
                const isMatch = await user.comparePassword(req.body.password);

                if (isMatch) {
                    const accessToken = await generateAccessToken(req, user);
                    return res.status(200).json({ success: true, accessToken, user });
                }
            }

            req.session.userAttempt++;
            return res.status(401).json({ msg: 'Authentification failed!' });
        } catch (error) {
            res.status(500).json({ msg: 'Internal error!' });
            throw error;
        }
    }

    return res.status(400).json({ msg: 'Validation failed', errors: validation.array() });
};
