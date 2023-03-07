import Routes from 'express';
import { handler } from '../controller/todo';

const routes = Routes();

routes.post('/',handler);
routes.get('/');
routes.patch('/:id');
routes.delete('/:id');

export default routes;
