import { Router } from 'express';

import objectController, { objectValidator } from './controllers/objectController';
import guard from '../../shared/middlewares/guard';

const objectRouter = Router();

objectRouter
    .use(guard)
    .get('/', objectController.getItems)
    .get('/:id', objectController.getItemById)
    .post('/', objectValidator, objectController.createItem)
    .put('/:id', objectValidator, objectController.updateItem)
    .delete('/:id', objectController.deleteItem);

export default objectRouter;
