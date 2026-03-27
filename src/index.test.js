const request = require('supertest');
const { app, add } = require('./index');

// --- Unit Tests ---
describe('add()', () => {
  test('adds two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('adds negative numbers', () => {
    expect(add(-1, -4)).toBe(-5);
  });

  test('adds zero', () => {
    expect(add(0, 7)).toBe(7);
  });

  test('adds floats', () => {
    expect(add(1.5, 2.5)).toBeCloseTo(4.0);
  });
});

// --- Integration Tests ---
describe('GET /', () => {
  it('returns 200 with message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Hello/);
  });
});

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /add/:a/:b', () => {
  it('returns correct sum for valid numbers', async () => {
    const res = await request(app).get('/add/3/4');
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(7);
  });

  it('returns correct sum for float numbers', async () => {
    const res = await request(app).get('/add/1.5/2.5');
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBeCloseTo(4.0);
  });

  it('returns 400 when first param is NaN', async () => {
    const res = await request(app).get('/add/foo/4');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 when second param is NaN', async () => {
    const res = await request(app).get('/add/3/bar');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 for both invalid params', async () => {
    const res = await request(app).get('/add/foo/bar');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
