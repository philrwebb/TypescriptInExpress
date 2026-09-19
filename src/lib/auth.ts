import { Kysely, SqliteDialect } from 'kysely';
import { betterAuth } from 'better-auth';
import { db } from '../db.js';

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
  baseURL: 'http://localhost:8000',
  secret: process.env.BETTER_AUTH_SECRET ?? 'this-is-a-very-long-development-secret-12345',
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  trustedOrigins: ['http://localhost:8000'],
});

export const initializeAuth = async (): Promise<void> => {
  const ctx = await auth.$context;
  await ctx.runMigrations();
};
