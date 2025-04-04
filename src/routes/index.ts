
import express, { Router } from "express";
import userRoutes from "./users.route";
import authRoutes from "./auth.route";
import otpRoutes from "./otp.route"
import twofaRoutes from "./two-fa.route"
import friend_requestRoute from "./friend_request.route";
import avatarRoute from "./avatar.route";

export const AppRoutes = (router: Router) => {
    userRoutes(router)
    otpRoutes(router)
    authRoutes(router)
    twofaRoutes(router)
    friend_requestRoute(router)
    avatarRoute(router)
}



