import request from 'supertest';

import { server } from '../src/index';
import { usersDB } from '../src/DB/usersDB';

describe('Test API', () => {
  afterAll((done) => {
    server.close(done);
  });

  let userId = '';

  it('GET /api/users', async () => {
    const res = await request(server).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.text).toEqual(JSON.stringify(usersDB));
  });

  it('POST /posts', async () => {
    const data = {
      username: 'Vitalik',
      age: 32,
      hobbies: ['Avto', 'Repair'],
    };

    const response = await request(server).post('/api/users').send(data);
    expect(response.status).toBe(201);
    userId = response.body.id;
    expect(JSON.stringify(response.body)).toBe(
      JSON.stringify({ ...data, id: response.body.id })
    );
  });

  it('GET /api/users/{UUID}', async () => {
    const res = await request(server).get(`/api/users/${userId}`);
    expect(res.status).toBe(200);
    expect(JSON.stringify(res.body)).toEqual(
      JSON.stringify(usersDB.find((user) => user.id === userId))
    );
  });

  it('DELETE /api/users/{UUID}', async () => {
    const res = await request(server).delete(`/api/users/${userId}`);
    expect(res.status).toBe(200);
    expect(undefined).toEqual(usersDB.find((user) => user.id === userId));
  });
});
