// src/routes/userRoutes.ts
import express, { Router } from "express";
import isAuthenticated from "../utils/isAuthenticated";
import { users_controller } from "../controllers/user.controller";


export default function (router: Router) {
    router.route("/my-profile").get([isAuthenticated], users_controller.getUsersProfile)
}




