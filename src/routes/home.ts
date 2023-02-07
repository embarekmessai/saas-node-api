import express, { Request } from "express";
import { Response } from 'express';
const router = express.Router();

router.get('/', async(req: Request, res: Response) => {
    return res.status(200).json({_csrf: req.csrfToken()});
});

export default router;