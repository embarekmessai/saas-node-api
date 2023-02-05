import CryptoJS from 'crypto-js';
import { Request } from 'express';
import Base64 from 'crypto-js/enc-base64';
import timeSafeCompare from 'tsscmp';
import config from '../../configs/config';


/**
 *  Types declaration
 */

declare module 'express-session' {
    interface SessionData {
        _csrfSecret: string;
    }
}

type SaltFunc = (length: number) => string;
type Create = (req: Request, length?: number) => {
                secret: string,    
                token: string,
                validate : (req : Request, token: string) => boolean
            };
/**
 *  Create new token method
 * @param req 
 * @param length 
 * @returns 
 */

const create : Create = (req: Request, length: number = 8) => {

    // Chek if express-session is installed
    var session = req.session;
    if (session === undefined) {
        throw new Error('The app requires req.session to be available in order to maintain state');
    }

    // CHeck if session has a secret key
   var secretKey = session._csrfSecret;
   
   if(!session._csrfSecret) {
        // Generete new secret key
        session._csrfSecret = Base64.stringify(CryptoJS.HmacSHA1(salt(length), config.key));
        secretKey = session._csrfSecret;
    } 

    // Save the secret for validation
    // if (!csrfKey) {
    //     const newToken = tokenize(salt(length), secretKey);
    //     session._csrf = newToken;
    // }

    return {
        secret: secretKey,
        token: tokenize(salt(length), secretKey), // Generate new csrf token
        validate: (req : Request, token: string) => {
            // Check if param token is string
            if (typeof token !== 'string') {
                return false;
            }
            // Check if param token equal requested token
            console.log('Tokens compare =', token, req.csrfToken()) // Log Tokens comparaison
            return timeSafeCompare(token, req.csrfToken());
        }
    };
}

function tokenize(salt: string, secret: string) {
    return salt + Base64.stringify(CryptoJS.HmacSHA1(salt, secret));
}

const salt: SaltFunc = (length : number = 8) => {
    let randomString : string = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        randomString += chars[Math.floor(Math.random() * chars.length)];
    }

    return randomString;
};



export default {create : create};