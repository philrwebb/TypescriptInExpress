import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';

let app: Awaited<ReturnType<typeof createApp>>;

describe('API auth and pet routes', () => {
  beforeAll(async () => {
    app = await createApp();
  });

  it('rejects requests to /pets without a valid session', async () => {
    const response = await request(app).get('/pets');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  it('allows a user to sign up and sign in', async () => {
    const email = `test-user-${Date.now()}@example.com`;
    const password = 'Password123!';

    const signupResponse = await request(app).post('/api/auth/sign-up/email').send({
      name: 'Test User',
      email,
      password,
    });

    expect(signupResponse.status).toBe(200);

    const signInResponse = await request(app).post('/api/auth/sign-in/email').send({
      email,
      password,
    });

    expect(signInResponse.status).toBe(200);
    expect(signInResponse.headers['set-cookie']).toBeDefined();
  });

  it('returns pets when the user is authenticated', async () => {
    const email = `pet-user-${Date.now()}@example.com`;
    const password = 'Password123!';
    const agent = request.agent(app);

    await agent.post('/api/auth/sign-up/email').send({
      name: 'Pet User',
      email,
      password,
    });

    const response = await agent.get('/pets');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
