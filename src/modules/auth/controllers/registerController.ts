import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import UserModel from '../../../shared/models/UserModel';

import { generateAccessToken } from '../services/generateTokenService';

const isEmailUnique = async (value: string) => {
    try {
        const user = await UserModel.findOne({ email: value });

        if (user) {
            return Promise.reject('Email already exists');
        }
    } catch (err) {
        console.error('Error in checking email uniqueness:', err);
        throw new Error('Server error');
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const passwordsMatch = (value: string, meta: any) => {
    if (value !== meta.req.body.password) {
        throw new Error('Passwords do not match');
    }
    return true;
};

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
            return res.status(200).json({ success: true, accessToken, user: user.toJSON() });
        } catch (error) {
            res.status(500).json({ msg: 'Internal error!' });
            throw error;
        }
    }

    return res.status(400).json({ msg: 'Validation failed', errors: validation.array() });
};
