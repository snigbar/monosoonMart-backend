import express from 'express';
import { userRoutes } from '../modules/users/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
const appRouter = express.Router();

const routes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
];

routes.forEach((val) => appRouter.use(val.path, val.route));

export default appRouter;
