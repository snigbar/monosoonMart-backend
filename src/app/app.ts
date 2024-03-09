import express, { Application } from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFoundApi from './notFoundApi/notFoundApi';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import appRouter from './routes/appRouter';
import config from './configs/config';

const app: Application = express();
app.use(
  cors({
    origin: config.client_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('hello...');
});

app.use('/api/v1', appRouter);

// global error handler
app.use(globalErrorHandler);
// not found api
app.use(notFoundApi);
export default app;
