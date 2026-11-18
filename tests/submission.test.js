const request = require('supertest');
const app = require('../app');

beforeEach(() => app.resetSubmissions());

describe('Assignment portal', () => {
  test('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('GET / serves the frontend', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Assignment Portal');
  });

  test('POST /api/submissions creates a submission', async () => {
    const res = await request(app)
      .post('/api/submissions')
      .send({ studentName: 'Ali', rollNo: 'FA21-BCS-001', title: 'DevOps Lab' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({ id: 1, studentName: 'Ali' });
  });

  test('POST /api/submissions rejects missing fields', async () => {
    const res = await request(app).post('/api/submissions').send({ studentName: 'Ali' });
    expect(res.statusCode).toBe(400);
  });

  test('GET /api/submissions lists submissions', async () => {
    await request(app)
      .post('/api/submissions')
      .send({ studentName: 'Sara', rollNo: 'FA21-BCS-002', title: 'CI/CD' });
    const res = await request(app).get('/api/submissions');
    expect(res.body).toHaveLength(1);
  });
});
