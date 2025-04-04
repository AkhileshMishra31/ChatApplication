import { Router } from "express";
import { friend_request_controller } from "../controllers/friend_request.controller";
import isAuthenticated from "../utils/isAuthenticated";

export default function (router: Router) {
    router.route("/send-friend-request").post(isAuthenticated, friend_request_controller.sendFriendRequest);
    router.route("/accept-friend-request").post(isAuthenticated, friend_request_controller.acceptFriendRequest);
    router.route("/cancel-friend-request").post(isAuthenticated, friend_request_controller.cancelFriendRequest);
    router.route("/get-friend-requests").get(isAuthenticated, friend_request_controller.getAllFriendRequests);
}