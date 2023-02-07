import { User, UserDocument } from "../src/app/models/User";
import request from 'supertest';
import app from '../src/app';


describe('Register Endpoint', ()=> {
    let csrfCookie: string;

    beforeEach(async()=> { 
        const response = request(app).get('/api/v1/csrf-cookie');
        csrfCookie = (await response).header['set-cookie'];
    })
    afterEach(async () => {
        await User.deleteOne({email: 'test@register.com'});
    });

    // Test user registration
    it('Regiter new user', async()=> {

        await request(app)
                .post('/api/v1/register')
                .set('Cookie', csrfCookie)
                .send({
                    firstname: "test",
                    lastname : "test",
                    email: "test@register.com",
                    password:"123456789",
                    password_confirmation:"123456789"
                })
                .expect(200);
        
    });

    // Test user confirmation password not match
    it('Regiter new user with wrong confirmation password', async() => {
      
        const response  = await request(app)
                .post('/api/v1/register')
                .set('Cookie', csrfCookie)
                .send({
                    firstname: "test",
                    lastname : "test",
                    email: "test@register.com",
                    password:"123456789",
                    password_confirmation:"123456"
                })
                .expect(400);
                expect(response.body).toHaveProperty('errors[0].msg', "Password confirmation do not match");
                expect(response.body).toHaveProperty('errors[0].param', 'password_confirmation');
    });

});

describe('Register with same email', ()=> {
    let user: UserDocument;
    let csrfCookie: string;
    beforeEach( async() => {
        user = await User.create({
            firstname: 'test_01',
            lastname : 'test_01',
            email: 'test_01@register.com',
            password: '123456789'
        });
        const response = request(app).get('/api/v1/csrf-cookie');
        csrfCookie = (await response).header['set-cookie'];

    });
    
    afterEach(async () => {
        await User.deleteOne({email: 'test_01@register.com'});
    });

    // Test regiter user with existing email address
    it('Regiter new user with existing email address', async()=> {

        const response = await request(app)
                .post('/api/v1/register')
                .set('Cookie', csrfCookie)
                .send({
                    firstname: "test",
                    lastname : "test",
                    email: "test_01@register.com",
                    password:"123456789",
                    password_confirmation:"123456789"
                })
                .expect(500);
                expect(response.body).toHaveProperty('errors[0].msg', "The email has already been taken.");
                expect(response.body).toHaveProperty('errors[0].param', 'email');
                
    });

        

})