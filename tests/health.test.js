import request from 'supertest';
import { app } from '../index.js';

describe('GET /health', () => {
  it('should return status ok and a timestamp', async () => {
    const response = await request(app.callback()).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });
}); 