import { User, UserDocument } from "../src/app/models/User";
import request from 'supertest';
import app from '../src/app';
import mongoose from "mongoose";


describe('Profile CRUD', () => {
    let user: UserDocument;
    let user01: UserDocument;
  let csrfCookie: string;
  beforeEach(async () => {
    // Create a user
    user = await User.create({
        firstname: 'test',
        lastname : 'test',
        email: 'test@profile.com',
        password: 'test123',
    });
    user01 = await User.create({
        firstname: 'test01',
        lastname : 'test01',
        email: 'test01@profile.com',
        password: 'test123',
    });

    // Generate csrf token
    const response = request(app).get('/api/v1/csrf-cookie');
    csrfCookie = (await response).header['set-cookie'];
  });

  afterEach(async () => {
    await User.deleteMany({email: ['test@profile.com', 'test01@profile.com']});
  });

  // Get user datas
  it('Get user profile informations', async() => {
        const res = await request(app).get(`/api/v1/profile/${user._id}`)
                        .expect(200);
                        expect(res.body).toHaveProperty('profile')
  })
  
  // Update user data
  it('Update user profile informations', async() => {
        const res = await request(app).patch(`/api/v1/profile/${user._id}`)
                        .set('Cookie', csrfCookie)
                        .send({
                            firstname: 'test01',
                            lastname : 'test01',
                            email: 'test@profile.com',
                        })
                        .expect(200);
                        expect(res.body).toHaveProperty('profile');
                        expect(res.body).toHaveProperty('success',"Profile updated successefully!");
  })
  
  // Update not exist user id 
  it('Update not existing user id', async() => {
        const res = await request(app).patch(`/api/v1/profile/${new mongoose.Types.ObjectId()}`)
                        .set('Cookie', csrfCookie)
                        .send({
                            firstname: 'test01',
                            lastname : 'test01',
                            email: 'test@profile.com',
                        })
                        .expect(400);
                        expect(res.body).toHaveProperty('errors[0].msg',"The selected user is invalid.");
                        expect(res.body).toHaveProperty('errors[0].param',"user");
  })
  
  // Update user with exist user id 
  it('Update user with existing user email', async() => {
        const res = await request(app).patch(`/api/v1/profile/${user._id}`)
                        .set('Cookie', csrfCookie)
                        .send({
                            firstname: 'test01',
                            lastname : 'test01',
                            email: 'test01@profile.com',
                        })
                        .expect(400);
                        expect(res.body).toHaveProperty('errors[0].msg',"The email has already been taken.");
                        expect(res.body).toHaveProperty('errors[0].param',"email");
  })
})