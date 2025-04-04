import { Router } from "express";
import isAuthenticated from "../utils/isAuthenticated";
import { onlyImageUpload } from "../utils/fileUpload.utility";
import { avatar_controller } from "../controllers/avatar.controller";
import { multerValidation } from "../middleware/isLoggedIn";

const filepath = "public/uploads/avatar"

export default function (router: Router) {
    router.route("/upload-avatar").post([isAuthenticated, onlyImageUpload(filepath).single('profile-picture'), multerValidation], avatar_controller.uploadAvatar)
}