import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import type { ValidationChain } from 'express-validator';

const validate = ( validations: ValidationChain[] ) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      for (let validation of validations) {
        const result: any = await validation.run(req);
        if (result.errors.length) break;
      }
  
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
  
      res.status(400).json({ errors: errors.array() });
    };
  };

  export default validate;