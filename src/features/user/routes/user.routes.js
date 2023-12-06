import express from "express";
import UserController from "../controller/user.controller.js";
import jwtAuth from "../../../middlewares/jwtAuth.js";

const router = express.Router();

const userController = new UserController();

// Routes for User SignUp
router.route("/signup").post((req, res) => {
    userController.postSignUp(req, res)
});
router.route("/signup").get((req, res) => {
    userController.getSignUp(req, res)
});

// Routes for User SignIn
router.route("/signin").get((req, res) => {
    userController.getSignIn(req, res) 
});
router.route("/signin").post((req, res) => {
    userController.postSignIn(req, res) 
});

// Route for User SignOut
router.route("/signout").get(jwtAuth, (req, res) => {
    userController.logout(req, res)
});

// Routes for User Update Password
router.route("/reset-password").get(jwtAuth, (req, res) => {
    userController.getUpdatePassword(req, res)
});
router.route("/reset-password").post(jwtAuth, (req, res) => {
    userController.postUpdatePassword(req, res)
});

// Routes for Forgot Password
router.route("/forgot-password").get((req, res) => {
    userController.getForgotPassword(req, res)
});
router.route("/forgot-password").post((req, res, next) => {
    userController.postForgotPassword(req, res, next)
});

export default router;
