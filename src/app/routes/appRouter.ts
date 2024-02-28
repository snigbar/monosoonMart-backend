import express from 'express';
import { userRoutes } from '../modules/users/user.routes';
const appRouter = express.Router();

const routes = [
  {
    path: '/users',
    route: userRoutes,
  },
];

routes.forEach((val) => appRouter.use(val.path, val.route));

export default appRouter;
