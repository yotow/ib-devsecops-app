const supertest = require('supertest');

jest.setTimeout(60 * 1000);
describe('transactions app', () => {
  const request = supertest(process.env.API_URL || 'http://localhost:9999');

  beforeAll(async () => {
    for (let i = 0; i < 5; i++) {
      try {
        console.log(`check health: ${i}`);
        await request.get('/health').expect(200);
        console.log('successfully connected');
        return;
      } catch (e) {
        console.log(e);
        await new Promise(resolve => setTimeout(() => resolve(), 5 * 1000));
      }
    }
  });

  test('should pass common path', async () => {
    const {body: {token}} = await request.post('/auth')
      .set('content-type', 'application/json')
      .send({
        login: 'vasya',
        password: 'secret',
      })
      .expect(200);
    expect(token).toBeDefined();

    const {body: {transactions}} = await request.get('/private/transactions')
      .set('content-type', 'application/json')
      .set('authorization', `Bearer ${token}`)
      .send()
      .expect(200);
    expect(transactions).toHaveLength(3);
  });

  test('should prevent unauthorized access', async () => {
    await request.get('/private/transactions')
      .set('content-type', 'application/json')
      .send()
      .expect(401);
  });
});
