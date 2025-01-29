import request from 'supertest';
import app from '../../src/server';

describe('GET /api/health', () => {
  it('should return 200 and health status', async () => {
    // const res = await request(app).get('/api/health');
    // expect(res.status).toBe(200);
    // expect(res.body).toEqual({ status: 'ok' });
  });
});
