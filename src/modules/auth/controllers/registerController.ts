import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import UserModel from '../../../shared/models/UserModel';

import { generateAccessToken } from '../services/generateTokenService';
import { isEmailUnique, passwordsMatch } from '../../../shared/utils/helpers';

export const registerValidator = [
    body('firstname').notEmpty().withMessage('Firstname is required'),
    body('lastname').notEmpty().withMessage('Lastname is required'),
    body('email')
        .isEmail()
        .withMessage('Email must be valid')
        .notEmpty()
        .withMessage('Email is required')
        .custom(isEmailUnique)
        .escape(),
    body('password').trim().notEmpty().withMessage('Password is required').escape(),
    body('confirmPassword')
        .trim()
        .notEmpty()
        .withMessage('Confirm password is required')
        .custom(passwordsMatch)
        .escape(),
];

export default async (req: Request, res: Response) => {
    const validation = validationResult(req);

    if (validation.isEmpty()) {
        try {
            const user = new UserModel(req.body);
            await user.save();

            const accessToken = await generateAccessToken(req, user);
            return res.status(200).json({ success: true, accessToken, user });
        } catch (error) {
            res.status(500).json({ msg: 'Internal error!' });
            throw error;
        }
    }

    return res.status(400).json({ msg: 'Validation failed', errors: validation.array() });
};
