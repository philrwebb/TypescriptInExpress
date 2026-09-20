import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.APP_PORT ?? 8000),
  baseUrl: process.env.APP_BASE_URL ?? 'http://localhost:8000',
  betterAuthSecret: process.env.BETTER_AUTH_SECRET ?? 'this-is-a-very-long-development-secret-12345',
  trustedOrigins: (process.env.APP_TRUSTED_ORIGINS ?? 'http://localhost:8000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};
