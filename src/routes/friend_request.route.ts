// src/routes/userRoutes.ts
import express from "express";
import { friend_request_controller } from "../controllers/friend_request.controller";
import isAuthenticated from "../utils/isAuthenticated";

const router = express.Router();


router.post("/send-friend-request", isAuthenticated, friend_request_controller.sendFriendRequest)


export default router;