import { Request, Response } from 'express';

/**
 * Get auth token
 * @param req 
 * @param res 
 * @returns _csrf
 */

const csrfToken = async(req: Request, res: Response) => {
    return res.status(200).json({_csrf: req.csrfToken()});
};

export default csrfToken;