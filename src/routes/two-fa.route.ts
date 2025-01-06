// src/routes/userRoutes.ts
import express from "express";
import { two_fa_controller } from "../controllers/two-fa.controller";
import isAuthenticated from "../utils/isAuthenticated";

const router = express.Router();


router.post("/enable-2fa", isAuthenticated,two_fa_controller.enableTwoFA)
router.post("/verify-2fa", isAuthenticated,two_fa_controller.verifyTwoFa)



export default router;