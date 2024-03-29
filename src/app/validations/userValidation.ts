import { body, check } from 'express-validator';
import validate from './Validation';

export const loginValidator = validate([
    check('email')
        .isEmail()
        .withMessage('Invalid email address'),
    check('password')
        .isLength({ min: 1 })
        .withMessage('Password must not be empty')
]);

export const registerValidator = validate([
    check('firstname')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Firstname must not be empty'),
    check('lastname')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Lastname must not be empty'),
    check('email')
        .isEmail()
        .withMessage(value => `${value} is an invalid email address`)
        .bail(),
    check('password')
        .exists()
        .isLength({ min: 8 })
        .withMessage('must be at least 8 chars long'),
    check('password_confirmation')
        .exists()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Password confirmation do not match')
        .bail(),
    ]);
    
    /**
     *  Email validation
    */
   export const emailValidator = validate([
       check('email')
       .isEmail()
       .withMessage('Invalid email address')
       .bail(),
]);

/**
 *  Password validation
 */
export const passwordValidation = validate([
    body('password')
        .exists()
        .isLength({ min: 8 })
        .withMessage('Must be at least 8 chars long'),
    body('password_confirmation')
        .exists()
        .custom((value, { req }) => value == req.body.password)
        .withMessage('Password confirmation do not match')
        .bail(),
])

/**
 *  User profile validation
 */

export const userProfileValidator = validate([
    check('firstname')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Firstname must not be empty'),
    check('lastname')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Lastname must not be empty'),
    check('email')
        .isEmail()
        .withMessage(value => `${value} is an invalid email address`)
        .bail(),
]);