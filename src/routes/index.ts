// src/routes/index.ts
import express from "express";
import userRoutes from "./users.route";
import authRoutes from "./auth.route";
import otpRoutes from "./otp.route"

const router = express.Router();

router.use("/api", userRoutes);
router.use("/api", authRoutes);
router.use("/api", otpRoutes)

export default router;
