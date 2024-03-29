import { Request, Response } from 'express';
import { User } from '../models/User';
import type { UserDocument } from '../models/User';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import { mailer } from '../../configs/mail';
import nodemailer from 'nodemailer';
import { randomString } from '../helpers/helper';
import config from '../../configs/config';
import { DateTime } from 'luxon';
/**
 * Get auth token
 * @param req 
 * @param res 
 * @returns _csrf
 */
export const getAuth = async(req: Request, res: Response) => {
    return res.status(200).json({_csrf: req.csrfToken()});
};

export const login = async(req: Request, res: Response) => {
    // try {
        // Get username
        const user: UserDocument = await User.findOne({email: req.body.email});

        if(!user) {
            return res.status(400).json({errors: [{msg: 'The selected email is invalid.', param: 'email'}]})
        }

        // const checkPassword = user.comparePassword(req.body.password);
        // Check user password
        // Get Hashed Passowrd
        const candidatePassword = req.body.password
        const userPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC).toString(CryptoJS.enc.Utf8);

        if( userPassword !== candidatePassword ) {
            return res.status(400).json({errors: [{msg : "The password is incorrect.", param: 'current_password'}]});
        }
        
        // Define access Token
        const jwtToken = jwt.sign({
            id: user._id
        },
        process.env.JWT_SEC, { expiresIn: "1h" }
        );
        
        // Save token in database
        user.accessToken = jwtToken;
        user.save();

        const { password, accessToken, createdAt, updatedAt, ...others } = user._doc // Hide password & token from response

        // Send response with data & access token
        return res.status(200).json({...others, accessToken });

        // res.status(200).json({...others, accessToken });
                
    // } catch (error) {
    //     const status = error.status || 500;
    //     res.status(status).json(error);
    // }
};

/**
 *  User registration
 */
export const register = async(req: Request, res: Response) => {
    
    try {
        // Add new user
        const newUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
        })
        const savedUser = await newUser.save();

        // Define access Token
        const jwtToken = jwt.sign({
            id: savedUser._id,
        },
        process.env.JWT_SEC, { expiresIn: "1h" }
        );
        
        // Save token in database
        savedUser.accessToken = jwtToken;
        savedUser.save();

        const { password, createdAt, updatedAt, accessToken, ...others } = savedUser._doc;

        // Send response with data & access token
        res.status(200).json({...others, accessToken, message: "Your registration has been done!" });

    } catch (err) {
        const status = err.status || 500;
        res.status(status).json({errors: [{msg: 'The email has already been taken.', param: 'email'}]});
    }
}


/**
 *  Send rest password link
 */
export const getPasswordRestLink = async(req: Request, res: Response) => {

    return res.status(200).json({_csrf: 'req.csrfToken()'});
};

// Send reset password link
export const passwordResetLink = async(req: Request, res: Response) => {
    // Find user
    const user: UserDocument = await User.findOne({email: req.body.email});
    
    // Check user existing
    if(!user) {
        return res.status(400).json({errors: [{msg: "We can't find a user with that email address.", param: "email"}]});
    }
    
    const encryptDatas = JSON.stringify({id: user._id as string, email: user.email})
    // Send rest password link email
    // Generate a reset password token
    // const resetToken = CryptoJS.SHA256(randomString(32)).toString(CryptoJS.enc.Hex);
    const resetToken = CryptoJS.AES.encrypt(encryptDatas, config.key).toString();
    const newExpiresDate = DateTime.now().setZone(config.time_zone).plus({ hours: 1, minutes: 2 });// 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = newExpiresDate.toJSDate();           
    await user.save();

    // Send the password reset email to the user
    const resetLink = `${config.origin_url}/reset-password?token=${resetToken}`;

    const message ={
        from: mailer.sender.from,
        to: user.email,
        subject: "Message title",
        text: "Plaintext version of the message",
        html: `<p>HTML version of the message</p><br/><a href="${resetLink}">${resetLink}</a>`
    };

    var transport = nodemailer.createTransport({
        host: mailer.smtp.host,
        port: mailer.smtp.port as number,
        auth: {
          user: mailer.smtp.username,
          pass: mailer.smtp.password
        }
      });
    
      transport.sendMail(message, (err, info) => {
        if(err) console.log(err);
        console.log(info);
    }) 
    
    return res.status(200).json({success: "We have emailed your password reset link!"});

};

/**
 *  Display the password reset view
 *  @param Request req
 *  @return Response res 
 */
export const passwordCreate = async(req: Request, res: Response) => {
        const token = req.query.token;
        
        // Decrypte token
        const getTokenDatas = CryptoJS.AES.decrypt(token as string, config.key).toString(CryptoJS.enc.Utf8);
        // Find user by id
        const tikenDatas = JSON.parse(getTokenDatas);
        const user = await User.findById(tikenDatas.id);

        // check if user not found
        if(!user) {
            return res.status(404).json({errors: [{msg: 'Page not found!', param: 'page'}]})
        }

        const TimeNow = DateTime.now().setZone(config.time_zone).toJSDate();

        if(TimeNow > user.passwordResetExpires){
            return res.status(400).json({ errors: [{msg: "Expired link", param: "date"}] });
        }

        return res.status(200).json({message : "Valid link", token: user.passwordResetToken})

}

/**
 *  Update password
 *  @param Request req
 *  @return Response res
 * 
 */
export const passwordUpdate = async(req: Request, res: Response) => {
    const token = req.body.token;

    // Decrypte token
    const getTokenDatas = CryptoJS.AES.decrypt(token, config.key).toString(CryptoJS.enc.Utf8);

    // Find user by id
    const tikenDatas = JSON.parse(getTokenDatas);
    const user = await User.findById(tikenDatas.id);

    // check if user not found
    if(!user) {
        return res.status(404).json({errors: [{msg: 'Page not found!', param: 'page'}]})
    }

    const TimeNow = DateTime.now().setZone(config.time_zone).toJSDate();
    console.log(TimeNow, user.email);

    if(TimeNow > user.passwordResetExpires){
       return res.status(400).json({ errors: [{msg: "Expired link", param: "date"}] });
    }

    // Update password
    user.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    user.passwordResetExpires = TimeNow;

    await user.save().then(() => console.log('User updated'));
    
    return res.status(200).json({message: "Your password has been reset!"});
    
}