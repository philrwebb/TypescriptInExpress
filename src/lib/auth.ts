import { Kysely, SqliteDialect } from 'kysely';
import { betterAuth } from 'better-auth';
import { db } from '../db.js';
import { env } from '../config/env.js';

const authDb = new Kysely({
  dialect: new SqliteDialect({
    database: db,
  }),
});

export const auth = betterAuth({
  database: {
    db: authDb,
    type: 'sqlite',
  },
  baseURL: env.baseUrl,
  secret: env.betterAuthSecret,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  trustedOrigins: env.trustedOrigins,
});

export const initializeAuth = async (): Promise<void> => {
  const ctx = await auth.$context;
  await ctx.runMigrations();
};
