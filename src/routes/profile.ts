import express from "express";
import * as profileController from "../app/controllers/profileController";
import { userProfileValidator, passwordValidation } from '../app/validations/userValidation';
import { upload } from "../app/middlewares/upload";

// import { NextFunction, Request, Response, Router } from "express";
var router = express.Router();


/* GET users listing. */
router.get('/profile/:id', profileController.index);
router.patch('/profile/:id', userProfileValidator, profileController.update);
router.post('/avatar/:id/update', upload.single('avatar'), profileController.updateAvatar);
router.post('/profile/reset-password', passwordValidation, profileController.profilePasswordUpdate);

export default router;
