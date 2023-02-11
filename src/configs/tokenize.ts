import * as dotenv from 'dotenv'
import { NextFunction, Request, Response } from 'express';
import Token from '../app/helpers/token';
import timeSafeCompare from 'tsscmp';
import jwt from 'jsonwebtoken';
import config from './config';

dotenv.config();

/**
 *  Types declaration
 */
declare module 'express' {
  interface Request {
    csrfToken: () => string;
  }
}

/**
 *  Vatiables
 */
const key : string = '_csrf';
const header : string = 'xsrf-token';
// const secret : string = '_csrfSecret';

const CSRF = () => {  
  /**
   *  Create a reandom signed tokeb
   * @param length 
   * @returns token
   */
  const setCSRFToken = (res: Response, token: string) => {
    // res.locals[key] = token; // templates rendered with res.render
    // res.set(header, token); // set token to header
    return res.cookie(
      'XSRF-TOKEN', 
      jwt.sign(
        {token: token}, 
        config.key, 
        { expiresIn: "1h" }
      ),
      {expires: new Date(Date.now() + 3600000)}); // cookie expire after 1h
  
  }
  
  /**
   *  Create a reandom signed tokeb
   * @param length 
   * @returns validate, token, secret
   */
  const getCSRFToken =  (req: Request, res: Response) => {

      // Ceate new csrf instance
    let csrf = Token.create(req);

    // Check secret token
    req.csrfToken = (): string => {
      var newCsrf = Token.create(req);
      
      if (csrf.secret && newCsrf.secret &&
        timeSafeCompare(csrf.secret, newCsrf.secret)) {            
          // Set token key to front
          setCSRFToken(res, csrf.token);
          return csrf.token;
        }
  
        // Set new token key
        setCSRFToken(res, newCsrf.token);
        return newCsrf.token;
    };

    return csrf;
  
  }
  
  const checkCSRFToken = (req: Request, res: Response, next: NextFunction) => {
    
    // Move along for safe verbs
    const method = req.method;
    
    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {

        getCSRFToken(req, res);

        return next();
    }
  
    const Validate = (req: Request, token: string) => {

      // Check if param token is string
      if (typeof token !== 'string') {
          return false;
      }

      if(req.cookies['XSRF-TOKEN']) {

        const reqCookie = jwt.verify(req.cookies['XSRF-TOKEN'], config.key)
        // Check if param token equal requested token
        console.log('Tokens compare =', token, (reqCookie as jwt.JwtPayload).token) // Log Tokens comparaison
        return timeSafeCompare(token, (reqCookie as jwt.JwtPayload).token);
        
      }

      next(new Error('forbidden'))
    } 
  

    let _token, cookieValue;
    if(req.headers.cookie) {
      
      const cookisArray = req.headers.cookie.split(';');
      console.log(cookisArray);

      cookisArray.forEach(element => {
        if(element.split('=')[0].match(/XSRF-TOKEN/) && 
          element.split('=')[0].match(/XSRF-TOKEN/)[0] == 'XSRF-TOKEN') 
          cookieValue = element.split('=')[1];
      });
    } 
           
    // Validate token
    if(!cookieValue) {
      _token = (req.body && req.body[key]) || '';
    
    } else {
      _token = (jwt.verify(cookieValue, config.key) as jwt.JwtPayload).token;
    }; 
    

    if (Validate(req, _token)) {
        next();
    } else {
        res.statusCode = 403;

        let errmsg = 'CSRF token mismatch';

        if (!_token) {
            errmsg = 'CSRF token missing';
        } 
  
        next(new Error(errmsg));
    }
  };

  return checkCSRFToken;
};

export default CSRF;