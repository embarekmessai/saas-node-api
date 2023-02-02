import * as authController from "../app/controllers/authController";
import express from "express";
import { loginValidator,  registerValidator} from "../app/validations/userValidation";
var router = express.Router();

// Login route
router.post('/login', loginValidator, authController.login);

// Register route
router.post('/register', registerValidator ,authController.register);

// Logout route
router.get('/logout', );

export default router;