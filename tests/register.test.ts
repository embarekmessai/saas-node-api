import { User, UserDocument } from "../src/app/models/User";
import request from 'supertest';
import app from '../src/app';


describe('Register Endpoint', ()=> {
    afterEach(async () => {
        await User.deleteOne({email: 'test@test.com'});
    });

    // Test user registration
    it('Regiter new user', ()=> {
        request(app).get('/api/v1/csrf-cookie', async()=> {
            await request(app)
                    .post('/api/v1/register')
                    .send({
                        firstname: "test",
                        lastname : "test",
                        email: "test@test.com",
                        password:"123456789",
                        password_confirmation:"123456789"
                    })
                    .expect(200);
        });
    });

    // Test user confirmation password not match
    it('Regiter new user with wrong confirmation password', ()=> {
        
        request(app).get('/api/v1/csrf-cookie', async()=> {
            await request(app)
                    .post('/api/v1/register')
                    .send({
                        firstname: "test",
                        lastname : "test",
                        email: "test@test.com",
                        password:"123456789",
                        password_confirmation:"123456789"
                    })
                    .expect(200);
                    expect((res: request.Response) => (res.body).toHaveProperty('errors[0].msg', /Password confirmation do not match/));
                    expect((res: request.Response) => (res.body).toHaveProperty('errors[0].param', 'password_confirmation'));
        });
    });
})