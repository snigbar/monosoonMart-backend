import express, { Application } from 'express';

const app: Application = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello...');
});

export default app;
