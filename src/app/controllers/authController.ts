import { Request, Response } from 'express';
import { User } from '../models/User';
import type { UserDocument } from '../models/User';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

export const login = async(req: Request, res: Response) => {
    try {
        // Get username
        const user: UserDocument = await User.findOne({email: req.body.email});

        // Check user password
        const checkPassword = user.comparePassword(req.body.password);
         
        if(!checkPassword) {
            return res.status(403).json({massage : "Mot de passe n'est pas correcte"});
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

        const { password, accessToken, createdAt, updatedAt, ...others } = user.$clone() // Hide password & token from response

        // Send response with data & access token
        res.status(200).json({...others, accessToken });

        // res.status(200).json({...others, accessToken });
                
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(error);
    }
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

        const { password, createdAt, updatedAt, accessToken, ...others } = savedUser.$clone();

        // Send response with data & access token
        res.status(200).json({...others, accessToken });

    } catch (err) {
        const status = err.status || 500;
        res.status(status).json({cerrors: err});
    }
}