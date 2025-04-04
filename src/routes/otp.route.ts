// src/routes/userRoutes.ts
import express, { Router } from "express";
import { otp_controller } from "../controllers/otp.controller";

export default function (router: Router) {
    router.route("/verify-otp").post(otp_controller.verifySignUpOTP)
    router.route("/resend-otp").post(otp_controller.resendSignUpOTP)
}


