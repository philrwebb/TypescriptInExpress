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

  it('returns products when the user is authenticated', async () => {
    const email = `product-user-${Date.now()}@example.com`;
    const password = 'Password123!';
    const agent = request.agent(app);

    await agent.post('/api/auth/sign-up/email').send({
      name: 'Product User',
      email,
      password,
    });

    const response = await agent.get('/products');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('creates a product when the user is authenticated', async () => {
    const email = `product-creator-${Date.now()}@example.com`;
    const password = 'Password123!';
    const agent = request.agent(app);

    await agent.post('/api/auth/sign-up/email').send({
      name: 'Product Creator',
      email,
      password,
    });

    const response = await agent.post('/products').send({
      name: 'Laptop Stand',
      description: 'Adjustable aluminium stand for laptops and monitors.',
      price: 59.99,
      stock: 12,
      sku: `LAPTOP-STAND-${Date.now()}`,
      isActive: true,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Laptop Stand');
    expect(response.body.description).toBe('Adjustable aluminium stand for laptops and monitors.');
  });
});
