import { body, validationResult } from 'express-validator';
import { Request, Response } from 'express';

import UserModel, { UserInterface, UserMethodsInterface } from '../../../shared/models/UserModel';

import generateControllerService from '../../../shared/services/generateControllerService';
import { isEmailUnique } from '../../../shared/utils/helpers';
import { RoleEnum } from '../../../shared/utils/enums';

const userValidator = [
    body('firstname').notEmpty().withMessage('Firstname is required'),
    body('lastname').notEmpty().withMessage('Lastname is required'),
    body('role')
        .notEmpty()
        .withMessage('Role is required')
        .custom((value: string) => {
            if (!Object.values(RoleEnum).includes(value as RoleEnum)) {
                return Promise.reject('Role is not valid');
            }

            return true;
        })
        .escape(),
    body('email')
        .isEmail()
        .withMessage('Email must be valid')
        .notEmpty()
        .withMessage('Email is required')
        .custom(isEmailUnique)
        .escape(),
];

export const createUserValidator = [
    ...userValidator,
    body('password').trim().notEmpty().withMessage('Password is required').escape(),
];

export const updateUserValidator = [...userValidator];

const userController = generateControllerService<UserInterface & UserMethodsInterface>(UserModel);

// Override updateItem method
userController.updateItem = async (req: Request, res: Response) => {
    const validation = validationResult(req);

    if (validation.isEmpty()) {
        try {
            const item = await UserModel.findById(req.params.id);

            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }

            Object.assign(item, req.body);

            const updateItem = await item?.save();

            return res.status(200).json({ success: true, item: updateItem });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return res.status(400).json({ message: err.message });
        }
    }

    return res.status(400).json({ msg: 'Validation failed', errors: validation.array() });
};

export default userController;
