// src/routes/userRoutes.ts
import { Router } from "express";
import { auth_controller } from "../controllers/auth.controller";

export default function (router: Router) {
    router.route("/sign-up").post(auth_controller.signup);
    router.route("/login").post(auth_controller.login);
    router.route("/refresh-token").post(auth_controller.refreshToken);
    router.route("/logout").post(auth_controller.logout)
}


