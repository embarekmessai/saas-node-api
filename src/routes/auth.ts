import * as authController from "../app/controllers/authController";
import express from "express";
import { emailValidator, loginValidator,  registerValidator} from "../app/validations/userValidation";
var router = express.Router();

// Login routes
router.post('/login', loginValidator, authController.login);
router.get('/login', authController.getAuth);

// Register routes
router.post('/register', registerValidator ,authController.register);
router.get('/register', authController.getAuth);

// Forgot password routes
router.post('/forgot-password', emailValidator, authController.passwordRestLink);
router.get('/forgot-password', authController.getPasswordRestLink);

// Logout route
router.get('/logout', );

export default router;