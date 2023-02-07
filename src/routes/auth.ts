import * as authController from "../app/controllers/authController";
import express from "express";
import { emailValidator, loginValidator,  passwordValidation,  registerValidator} from "../app/validations/userValidation";
var router = express.Router();

// Login routes
router.post('/login', loginValidator, authController.login);
router.get('/login', authController.getAuth);

// Register routes
router.post('/register', registerValidator ,authController.register);
router.get('/register', authController.getAuth);

// Forgot password routes
router.post('/forgot-password', emailValidator, authController.passwordResetLink);
router.get('/forgot-password', authController.getPasswordRestLink);

// Reset password 
router.get('/reset-password/:token', authController.passwordCreate);
router.post('/reset-password', passwordValidation, authController.passwordUpdate);

// Logout route
router.get('/logout', );

export default router;