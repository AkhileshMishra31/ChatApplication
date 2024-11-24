// src/routes/userRoutes.ts
import express from "express";
import { otp_controller } from "../controllers/otp.controller";

const router = express.Router();


router.post("/verify-otp", otp_controller.verifySignUpOTP)
router.post("/resend-otp", otp_controller.resendSignUpOTP)


export default router;
