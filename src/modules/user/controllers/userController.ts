import { body } from 'express-validator';

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

export default userController;
