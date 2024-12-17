// src/routes/index.ts
import express from "express";
import userRoutes from "./users.route";
import authRoutes from "./auth.route";
import otpRoutes from "./otp.route"

const router = express.Router();

router.use(userRoutes);
router.use(authRoutes);
router.use(otpRoutes);

export default router;
