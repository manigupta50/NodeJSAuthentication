import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

import { customErrorHandler } from "../../../middlewares/errorHandler.js";
import { compareHashedPassword, hashPassword } from "../../../utils/hashPassword.js";
import { UserModel } from "./user.schema.js";
import { sendMail } from "../../../utils/mailer.js";

export default class UserRepository {

    // Repository for signing up
    async postSignUp(userData) {
        try {
            const email = userData.email;
            const user = await UserModel.findOne({ email });
            if(user) {
                return null;
            }
            const newUser = new UserModel(userData);
            await newUser.save();
            await sendMail("WELCOME", email);
            return newUser;
        } catch(err) {
            console.log(err);
            throw new customErrorHandler(500, "Something went wrong in Repository.");
        }
    };

    // Repository for signing in
    async postSignIn(userData) {
        try {
            const { email, password } = userData;
            const emailFind = await UserModel.findOne({ email });
            if(!emailFind) {
                return { success: false, msg: "User Not Found", statusCode: 404 };
            } else {
                const user = await compareHashedPassword(password, emailFind.password);
                if(!user) {
                    return { success: false, msg: "Incorrect Password", statusCode: 400 };
                }
                const token = jwt.sign(
                    { userId: emailFind._id, userEmail: email },
                    process.env.SECRET_KEY,
                    { expiresIn: "1h" }
                );
                return { success: true, msg: "Logged in successfully", details: emailFind, token: token };
            }
        } catch(err) {
            console.log(err);
            throw new customErrorHandler(500, "Something went wrong in Repository.");
        }
    };

    // Repository for updating the password
    async postUpdatePassword(id, newPassword) {
        try {
            const hashedPassword = await hashPassword(newPassword);
            let user = await UserModel.findOne( { _id: id } );
            if(!user) {
                return { success: false, error: { msg: "User Not Found", statusCode: 404 } };
            } else {
                user.password = hashedPassword;
                await user.save();
                await sendMail("PASSWORD-UPDATE", user.email);
                return { success: true, error: { msg: user, statusCode: 201 } };
            }
        } catch(err) {
            console.log(err);
            return { success: false, error: { msg: err, statusCode: 400 } };
        }
    };

    // Repository for updating the password through forgot password
    async postForgotPassword(email, next) {
        try {
            const findUser = await UserModel.findOne({ email: email });
            if(!findUser) {
                return { success: false, error: { msg: "User Not Found!", statusCode: 404 } };
            } else {
                const password = Math.random().toString(36).substr(2, 8);
                const hashedPassword = await hashPassword(password, next);
                findUser.password = hashedPassword;
                await findUser.save();
                await sendMail("PASSWORD-RESET", email, password);
                return { success: true, error: { msg: "New password sent through Email!", statusCode: 201 } };
            }
        } catch(err) {
            console.log(err);
            return { success: false, error: { msg: err, statusCode: 400 } };
        }
    };
};