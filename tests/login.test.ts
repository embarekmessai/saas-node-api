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
  let csrfCookie: string;
  beforeEach(async () => {
    // Create a user
    user = await User.create({
        firstname: 'test',
        lastname : 'test',
        email: 'test@example.com',
        password: 'test123',
    });

    // Generate csrf token
    const response = request(app).get('/api/v1/csrf-cookie');
    csrfCookie = (await response).header['set-cookie'];
  });

  afterEach(async () => {
    await User.deleteMany({email: 'test@example.com'});
  });

  it('should return 200 and access token', async () => {
    await request(app)
      .post('/api/v1/login')
      .set('Cookie', csrfCookie)
      .send({
        email: 'test@example.com',
        password: 'test123'
      });
    expect(200);
    expect((res: request.Response) => (res.body).toHaveProperty('accessToken'));
    // expect(res.body).toHaveProperty('email', 'test@example.com');
  });

  it('should return 403 with invalid password', async () => {
    await request(app)
      .post('/api/v1/login')
      .set('Cookie', csrfCookie)
      .send({
        email: 'test@example.com',
        password: 'invalid'
      });
    expect(400);
    expect((res: request.Response) => (res.body).toHaveProperty('errors[0].msg', /The password is incorrect./));
    expect((res: request.Response) => (res.body).toHaveProperty('errors[0].param', 'current_password'));
  });

  // Test user confirmation password not match
  it('Login with not exiting email', async() => {
        
    await request(app)
            .post('/api/v1/register')
            .set('Cookie', csrfCookie)
            .send({
                email: "test@test.com",
                password:"123456789"
            })
            .expect(400);
            expect((res: request.Response) => (res.body).toHaveProperty('errors[0].msg', /The selected email is invalid./));
});
});
