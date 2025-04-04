import { Router } from "express";
import { two_fa_controller } from "../controllers/two-fa.controller";
import isAuthenticated from "../utils/isAuthenticated";

export default function (router: Router) {
    router.route("/enable-2fa").post(isAuthenticated, two_fa_controller.enableTwoFA);
    router.route("/verify-2fa").post(isAuthenticated, two_fa_controller.verifyTwoFa);
}
