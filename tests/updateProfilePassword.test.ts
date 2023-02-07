import request from 'supertest';
import { User, UserDocument } from '../src/app/models/User';
import app from '../src/app';
import { randomString } from '../src/app/helpers/helper';
import CryptoJS from 'crypto-js';
import config from '../src/configs/config';

describe('Update user password profile', ()=> {
    let user: UserDocument;
    const resetToken = CryptoJS.SHA256(randomString(32)).toString(CryptoJS.enc.Hex);
    let csrfCookie: string;

    beforeEach(async () => {
        // Create a user
        user = await User.create({
            firstname: 'test',
            lastname : 'test',
            email: 'test@profile-update-password.com',
            password: CryptoJS.AES.encrypt('test123', config.pass_key).toString(),
            passwordResetToken: resetToken,
            passwordResetExpires: new Date(Date.now() + 60 * 60 * 5)
        });

        // Generate csrf token
        const response = request(app).get('/api/v1/csrf-cookie');
        csrfCookie = (await response).header['set-cookie'];
      });
    
      afterEach(async () => {
        await User.deleteMany({email: 'test@profile-update-password.com'});
      });

    // Update user password validation
  it('Update user password validation', async() => {

      const res = await request(app).get(`/api/v1/reset-password/${user.passwordResetToken}`)
                      .expect(200);
                      expect(res.body).toHaveProperty('message',"Valid link");
    });

    // Update user password 
    it('Update user password', async() => {
    const res = await request(app).post(`/api/v1/reset-password`)
                    .set('Cookie', csrfCookie)
                    .send({
                        current_password: 'test123',
                        password: '123456789',
                        password_confirmation: '123456789',
                        token : resetToken
                    })
                    .expect(200);
                    expect(res.body).toHaveProperty('message', 'Your password has been reset!');
    });

    // Update user password with wong current pass
    it('Update user password with wong current pass', async() => {
    const res = await request(app).post(`/api/v1/reset-password`)
                    .set('Cookie', csrfCookie)
                    .send({
                        current_password: 'test1232',
                        password: '123456789',
                        password_confirmation: '123456789',
                        token : resetToken
                    })
                    .expect(400);
                    expect(res.body).toHaveProperty('errors[0].msg', 'The password is incorrect.');
                    expect(res.body).toHaveProperty('errors[0].param', 'current_password');
    });
    
    // Update user password confirmation does not match
    it('Update user password confirmation does not match', async() => {
    const res = await request(app).post(`/api/v1/reset-password`)
                    .set('Cookie', csrfCookie)
                    .send({
                        current_password: 'test123',
                        password: '12345678922',
                        password_confirmation: '123456789',
                        token : resetToken
                    })
                    .expect(400);
                    expect(res.body).toHaveProperty('errors[0].msg', 'Password confirmation do not match');
                    expect(res.body).toHaveProperty('errors[0].param', 'password_confirmation');
    });
});

