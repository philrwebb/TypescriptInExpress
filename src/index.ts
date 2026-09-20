import { createApp } from './app.js';
import { env } from './config/env.js';

const startServer = async (): Promise<void> => {
  const app = await createApp();

  app.listen(env.port, (): void => {
    console.log(`Server is running at ${env.baseUrl}`);
  });
};

if (require.main === module) {
  void startServer();
}

export { createApp };
