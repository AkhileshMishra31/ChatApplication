// src/routes/index.ts
import express from "express";
import userRoutes from "./users.route";
import authRoutes from "./auth.route";
import otpRoutes from "./otp.route"
import twofaRoutes from "./two-fa.route"

const router = express.Router();

router.use(userRoutes);
router.use(authRoutes);
router.use(otpRoutes);
router.use(twofaRoutes);


export default router;
