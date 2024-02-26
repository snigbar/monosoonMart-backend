import express, { Application } from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFoundApi from './notFoundApi/notFoundApi';

const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello...');
});

// global error handler
app.use(globalErrorHandler);
// not found api
app.use(notFoundApi);
export default app;
