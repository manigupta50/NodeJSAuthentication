import express from 'express';
import HomeController from '../controller/home.controller.js';
import jwtAuth from '../../../middlewares/jwtAuth.js';

const router = express.Router();

const homeController = new HomeController();

router.route("/").get(jwtAuth, (req, res) => {
    homeController.home(req, res)
});
router.route("/").post(jwtAuth, (req, res) => {
    homeController.home(req, res)
});

export default router;