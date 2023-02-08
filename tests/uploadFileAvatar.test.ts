import { User, UserDocument } from '../src/app/models/User';
import request from 'supertest';
import app from '../src/app';
import path from 'path';


describe('Upload & update profile avatar', () => {
    let user: UserDocument;
    let csrfCookie: string;
    beforeEach(async () => {
        // Create a user
        user = await User.create({
            firstname: 'test',
            lastname : 'test',
            email: 'test@profile-avatar.com',
            password: 'test123',
        });

        // Generate csrf token
        const response = request(app).get('/api/v1/csrf-cookie');
        csrfCookie = (await response).header['set-cookie'];
    });

    afterEach(async () => {
        await User.deleteMany({email: 'test@profile-avatar.com'});
    });

    it('Upload file avatar to user', async () => {
        const filePath = path.resolve(__dirname, '../storage/app/public/avatars/1675813472805-8-deeplearning.jpg');
        
        const res = await request(app).post(`/api/v1/avatar/${user._id}/update`)
                            .set('Cookie', csrfCookie)
                            // .set('Content-Type', 'multipart/form-data')
                            .attach('avatar', filePath)
                            // .query({file: filePath, name: 'avatar'})
                            .expect(200)
                            expect(res.body).toHaveProperty('avatar');
                            expect(res.body).toHaveProperty('message', 'Avatar uploaded successfully');
    })

})