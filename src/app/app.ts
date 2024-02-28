import express, { Application } from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFoundApi from './notFoundApi/notFoundApi';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

app.get('/', (req, res) => {
  res.send('hello...');
});

// global error handler
app.use(globalErrorHandler);
// not found api
app.use(notFoundApi);
export default app;
