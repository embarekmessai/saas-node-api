import request from 'supertest';
import { User, UserDocument } from '../src/app/models/User';
import app from '../src/app';
import CryptoJS from 'crypto-js';
import config from '../src/configs/config';
import { DateTime } from 'luxon';

describe('Update user password profile', ()=> {
    let user: UserDocument;
    
    let csrfCookie: string;
    let resetToken: string;
    
    beforeEach(async () => {
      // Create a user
        user = await User.create({
            firstname: 'test',
            lastname : 'test',
            email: 'test@update-password.com',
            password: CryptoJS.AES.encrypt('test123', config.pass_key).toString(),
          });
          
          // Set a reset password token
          const encryptDatas = JSON.stringify({id: user._id as string, email: user.email})
          resetToken = CryptoJS.AES.encrypt(encryptDatas, config.key).toString();
          user.passwordResetToken = resetToken;
          user.passwordResetExpires = DateTime.now().setZone(config.time_zone).plus({ hours: 2, minutes: 2 }).toJSDate();
          await user.save();

        // Generate csrf token
        const response = request(app).get('/api/v1/csrf-cookie');
        csrfCookie = (await response).header['set-cookie'];
      });
    
      afterEach(async () => {
        await User.deleteMany({email: 'test@update-password.com'});
      });

    // Update user password validation
  it('Update user password validation', async() => {

      const res = await request(app).get(`/api/v1/reset-password?token=${user.passwordResetToken}`)
                      .expect(200);
                      expect(res.body).toHaveProperty('message',"Valid link");
    });

    // Update user password 
    it('Update user password', async() => {
    const res = await request(app).post(`/api/v1/reset-password`)
                    .set('Cookie', csrfCookie)
                    .send({
                        password: '123456789',
                        password_confirmation: '123456789',
                        token : resetToken
                    })
                    .expect(200);
                    expect(res.body).toHaveProperty('message', 'Your password has been reset!');
    });
    
    // Update user password confirmation does not match
    it('Update user password confirmation does not match', async() => {
    const res = await request(app).post(`/api/v1/reset-password`)
                    .set('Cookie', csrfCookie)
                    .send({
                        password: '12345678922',
                        password_confirmation: '123456789',
                        token : resetToken
                    })
                    .expect(400);
                    expect(res.body).toHaveProperty('errors[0].msg', 'Password confirmation do not match');
                    expect(res.body).toHaveProperty('errors[0].param', 'password_confirmation');
    });
});

