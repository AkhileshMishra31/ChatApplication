// src/routes/userRoutes.ts
import express from "express";
import { isAuthenticated } from "../utils/isAuthenticated";
import { users_controller } from "../controllers/user.controller";

const router = express.Router();


router.post("/my-profile", 
    isAuthenticated,
    users_controller.getUsersProfile
)


export default router;
