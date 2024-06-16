import { body } from 'express-validator';

import ObjectModel, { ObjectInterface } from '../models/ObjectModel';

import generateControllerService from '../../../shared/services/generateControllerService';

export const objectValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
];

const objectController = generateControllerService<ObjectInterface>(ObjectModel);

export default objectController;
