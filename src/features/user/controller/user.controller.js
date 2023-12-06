import UserRepository from "../model/user.repository.js";
import { customErrorHandler } from "../../../middlewares/errorHandler.js";
import { hashPassword } from "../../../utils/hashPassword.js";

export default class UserController {

  constructor() {
    this.userRepository = new UserRepository();
  }

  // Controllers for User Registration
  async getSignUp(req, res) {
    return res.render('signup');
  }
  async postSignUp(req, res) {
    const { email } = req.body;
    let { password } = req.body;
    try {
      const hashedPassword = await hashPassword(password);
      password = hashedPassword;
      const userData = { email, password };
      const user = await this.userRepository.postSignUp(userData);
      if(user) return res.status(201).redirect('/api/users/signin', { success: true });
      else return res.status(400).render('signup', { success: false, msg: "Email already in use" });
    } catch(err) {
        console.log(err);
        throw new customErrorHandler(500, "Something went wrong in Controller.");
    }
  };

  // Controllers for User Login
  async getSignIn(req, res) {
    return res.render('signin', { success: true });
  }
  async postSignIn(req, res) {
    try {
      let status = await this.userRepository.postSignIn(req.body);
      if (status.success) {
        res
          .status(201)
          .cookie('jwtToken', status.token, {maxAge: 900000, httpOnly: false})
          .cookie("userId", status.details._id, { maxAge: 900000, httpOnly: false })
          .cookie("name", status.details.name, { maxAge: 900000, httpOnly: false })
          .redirect('/api/home');
          // .json({ status: "success", msg: "login successful", token: status.token});
          
      } else {
        res.status(400).render('signin', { success: false, msg: status.msg });
      }
    } catch(err) {
        console.log(err);
        throw new customErrorHandler(500, "Something went wrong in Controller.");
    }
  };

  // Controller for User SignOut
  async logout(req, res, next) {
    try {
      res.clearCookie("jwtToken").render('signin', { success: false, msg: "Logout Successful" });
    } catch(err) {
        console.log(err);
        throw new customErrorHandler(500, "Something went wrong in Controller.");
    }
  };

  // Controller for Update Password
  async getUpdatePassword(req, res) {
    return res.render('password-reset');
  };
  async postUpdatePassword(req, res, next) {
    try {
      const { password } = req.body;
      const userId = req.cookies.userId;
      const resp = await this.userRepository.postUpdatePassword(userId, password);
      if (resp.success) {
        res.status(201).redirect('/api/home'); //, { success: true, msg: "Password Updated Successfully" });
      } else {
        return next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
      }
    } catch(err) {
        console.log(err);
        throw new customErrorHandler(500, "Something went wrong in Controller.");
    }
  };

  // Controller for Forget Password
  async getForgotPassword(req, res) {
    return res.render('forgot-password', { msg: null });
  };
  async postForgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await this.userRepository.postForgotPassword(email, next);
      return res.status(result.error.statusCode).render('forgot-password', { msg: result.error.msg })
    } catch(err) {
        console.log(err);
        throw new customErrorHandler(500, "Something went wrong in Controller.");
    }
  };
}