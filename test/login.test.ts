import request from 'supertest';
import { User, UserDocument } from '../src/app/models/User';
import app from '../src/app';

describe('Get Login', ()=> {
  it('Should return status 200', () => {
    request(app).get('/api/v1/login');
    expect(200);
    expect((res: request.Response) => (res.body).toHaveProperty('_csrf'))
  })
});

describe('Login Endpoint', () => {
  let user: UserDocument;
  beforeEach(async () => {

    user = await User.create({
        firstname: 'test',
        lastname : 'test',
        email: 'test@example.com',
        password: 'test123',
    });
  });

  afterEach(async () => {
    await User.deleteMany({email: 'test@example.com'});
  });

  it('should return 200 and access token', async () => {
    await request(app).get('/api/v1/login', async(result) => {
      await request(app)
        .post('/api/v1/login')
        .set('Cookie',['XSRF-TOKEN', '123456789'])
        .send({
          email: 'test@example.com',
          password: 'test123',
          _csrf: result._csrf
        });
      expect(200);
      expect((res: request.Response) => (res.body).toHaveProperty('accessToken'));

    })
    // expect(res.body).toHaveProperty('email', 'test@example.com');
  });

  it('should return 403 with invalid password', async () => {
    await request(app)
      .post('/api/v1/login')
      .send({
        email: 'test@example.com',
        password: 'invalid',
        _csrf: expect.any(String)
      });
    expect(403);
    expect((res: request.Response) => (res.body).toHaveProperty('message'));
  });
});
