import app from './app';

import { Server } from 'http';
import config from './configs/config';

let server: Server;

async function main() {
  try {
    // await mongoose.connect(config.mongoDBURL as string)
    server = app.listen(config.port, () =>
      // eslint-disable-next-line no-console
      console.log(`Running on port ${config.port}`),
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

main();

process.on('unhandledRejection', () => {
  // eslint-disable-next-line no-console
  console.log(`😈 unahandledRejection is detected , shutting down ...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  process.exit(1);
});
