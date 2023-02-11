import request from 'supertest';
import { User, UserDocument } from '../src/app/models/User';
import app from '../src/app';
import CryptoJS from 'crypto-js';
import config from '../src/configs/config';

describe('Update password profile', ()=> {
    let user: UserDocument;
    let csrfCookie: string;

    beforeEach(async () => {
        // Create a user
        user = await User.create({
            firstname: 'test',
            lastname : 'test',
            email: 'test@profile-update-password.com',
            password: CryptoJS.AES.encrypt('test123', config.pass_key).toString()
        });

        // Generate csrf token
        const response = request(app).get('/api/v1/csrf-cookie');
        csrfCookie = (await response).header['set-cookie'];
    });
    
    afterEach(async () => {
    await User.deleteMany({email: 'test@profile-update-password.com'});
    });


    // Update profile password 
    it('Update profile password', async() => {
    const res = await request(app).post(`/api/v1/profile/reset-password`)
                    .set('Cookie', csrfCookie)
                    .send({
                        id: user._id,
                        current_password: 'test123',
                        password: '123456789',
                        password_confirmation: '123456789',
                    })
                    .expect(200);
                    expect(res.body).toHaveProperty('message', 'Your password has been reset!');
    });

    // Update profile password with wong current pass
    it('Update profile password with wong current pass', async() => {
    const res = await request(app).post(`/api/v1/profile/reset-password`)
                    .set('Cookie', csrfCookie)
                    .send({
                        id: user._id,
                        current_password: '_test123',
                        password: '123456789',
                        password_confirmation: '123456789',
                    })
                    .expect(400);
                    expect(res.body).toHaveProperty('errors[0].msg', 'The password is incorrect.');
                    expect(res.body).toHaveProperty('errors[0].param', 'current_password');
    });
    
    // Update profile password confirmation does not match
    it('Update profile password not match confirmation', async() => {
    const res = await request(app).post(`/api/v1/profile/reset-password`)
                    .set('Cookie', csrfCookie)
                    .send({
                        id: user._id,
                        current_password: 'test123',
                        password: '123456789',
                        password_confirmation: '_123456789',
                    })
                    .expect(400);
                    expect(res.body).toHaveProperty('errors[0].msg', 'Password confirmation do not match');
                    expect(res.body).toHaveProperty('errors[0].param', 'password_confirmation');
    });
});

