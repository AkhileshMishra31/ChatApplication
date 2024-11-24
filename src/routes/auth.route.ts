// src/routes/userRoutes.ts
import express from "express";
import { auth_controller } from "../controllers/auth.controller";

const router = express.Router();


router.post("/sign-up",auth_controller.signup)


export default router;
