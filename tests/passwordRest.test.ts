import app from "../src/app";
import { User, UserDocument } from "../src/app/models/User";
import request from 'supertest';


describe('Send email to the server for password recovery', () => {
    let user: UserDocument;
    let csrfCookie: string;

    beforeEach( async() => {
        // create new user instance 
        user = await User.create({
            firstname: 'test',
            lastname : 'test',
            email: 'test@test.com',
            password: '123456789'
        });

        // Set a csrf cookie
        const response = request(app).get('/api/v1/csrf-cookie');
        csrfCookie = (await response).header['set-cookie'];
    });

    afterEach(async () => {
        await User.deleteOne({email: 'test@test.com'});
    });

    // Send password rest link
    it('Send a password link email', async() => {
        const res = await request(app).post('/api/v1/forgot-password')
                        .set('Cookie', csrfCookie)
                        .send({ email: 'test@test.com'})
                        .expect(200);
                        expect(res.body).toHaveProperty('success', 'We have emailed your password reset link!')
    })
})