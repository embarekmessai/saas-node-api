import express from "express";
import * as profileController from "../app/controllers/profileController";
import { userProfileValidator } from "../app/validations/userValidation";

// import { NextFunction, Request, Response, Router } from "express";
var router = express.Router();


/* GET users listing. */
router.get('/profile/:id', profileController.index);
router.patch('/profile/:id', userProfileValidator, profileController.update);

export default router;
