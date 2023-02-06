import express from "express";
const router = express.Router();
import csrfController from "../app/controllers/csrfController";

router.get('/csrf-cookie', csrfController);

export default router;
