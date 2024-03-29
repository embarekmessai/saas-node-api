import { Request, Response } from "express";
import { User, Profile } from '../models/User';
import fs from 'fs';
import CryptoJS from 'crypto-js';
import config from '../../configs/config';

/**
 *  Get user profile datas
 *  @param Request req
 *  @param Response res
 *  @param string id
 *  @return json profile
 */

export const index = async(req: Request, res: Response) => {
    try {
        const id = req.params.id; // Get id
        // Find user
        const user = await User.findById(id)
    
        if(!user) {
            return res.status(400).json({errors: [{msg: 'The selected user is invalid.', param: 'user'}]})
        }
    
        // Get profile data
        const {password, passwordResetToken, passwordResetExpires, accessToken, ...others} = user._doc;
    
        return res.status(200).json({profile: others});
        
    } catch (error) {
        return res.status(500).json({errors: [{msg:'Invalid request'}]});
    }

}

/**
 *  Update user datas
 *  @param Request req
 *  @return Response res
 *  
 */
export const update = async(req: Request, res: Response) => {

    const id = req.params.id; // Get id
    // Find user
    const user = await User.findById(id)

    if(!user) {
        return res.status(400).json({errors: [{msg: 'The selected user is invalid.', param: 'user'}]})
    }

    // Check unique email
    const bodyEmail = req.body.email;
    if(bodyEmail) {

        // Skipping user email
        if(user.email !== bodyEmail){
            const existsEmail = await User.findOne({email : bodyEmail});
            if (existsEmail) {
                return res.status(400).json({errors: [{msg: 'The email has already been taken.', param: 'email'}]})
            }
        }

    }
    

    // Update user datas
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.email = bodyEmail;
    user.profile.mobile = req.body.mobile;
    user.profile.description = req.body.description;
    user.profile.address = req.body.address;
    user.profile.city = req.body.city;
    user.profile.postal_code = req.body.postal_code;
    user.profile.country = req.body.country;
    user.profile.latitude = req.body.latitude;
    user.profile.longitude = req.body.longitude;
    user.profile.presentation = req.body.presentation;
    user.profile.whatsapp = req.body.whatsapp;
    user.profile.facebook = req.body.facebook;
    user.profile.youtube = req.body.youtube;
    user.profile.instagram = req.body.instagram;
    user.profile.snapshat = req.body.snapshat;
    user.profile.tiktok = req.body.tiktok;
    user.profile.linkedin = req.body.linkedin
    
    await user.save();

    // Get profile data
    const {password, passwordResetToken, passwordResetExpires, accessToken, ...others} = user._doc;

    return res.status(200).json({success: "Profile updated successefully!", profile: others});

}

/**
 *  Update user avatar
 *  @param Request req
 *  @return Response res
 */
export const updateAvatar = async(req: Request, res: Response) => {
    const file = req.file;
    const filePath = file.path;

    const id = req.params.id; // Get id
    // Find user
    const user = await User.findById(id)

    if(!user) {
        return res.status(400).json({errors: [{msg: 'The selected user is invalid.', param: 'user'}]})
    }

    const fileName =  Date.now() + '-'+file.originalname
    // upload file 
    fs.readFile(filePath, (err, data) => {
        fs.writeFile(`storage/app/public/avatars/${fileName}`, data, (err) => {
            if(err) {
                return res.status(403).json({errors: [{ msg:'Not Modified', param: 'avatar' }]})
            }
            fs.unlink(filePath, async(err) => {
                if(err) {
                    return res.status(403).json({errors: [{ msg:'Not deleted ftom temp folder', param: 'avatar' }]})
                }
                // Save path 
                user.profile.avatar = `avatars/${fileName}`;
                await user.save();
                return res.status(200).json({avatar: user.profile.avatar, message: 'Avatar uploaded successfully' });
            });
        });
      });

}

/**
 *  Update profile password
 *  @param Request req
 *  @return Response res
 * 
 */
export const profilePasswordUpdate = async(req: Request, res: Response) => {
    const id = req.body.id;

    // Find user by token
    const user = await User.findOne({_id: id});

    // check if user not found
    if(!user) {
        return res.status(404).json({errors: [{msg: 'Page not found!', param: 'page'}]})
    }

    // Check if current is correct
    const candidatePassword = req.body.current_password;
    const userPassword = CryptoJS.AES.decrypt(user.password, config.pass_key).toString(CryptoJS.enc.Utf8);

    if( userPassword !== candidatePassword ) {
        return res.status(400).json({errors: [{msg : "The password is incorrect.", param: 'current_password'}]});
    }

    // Update password
    user.password = req.body.password;
    user.save();
    
    return res.status(200).json({message: "Your password has been reset!"});
    
}