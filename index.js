import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import ejsLayouts from 'express-ejs-layouts';
import cors from 'cors';
import passport from 'passport';
import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';

import { invalidRoutesHandlerMiddleware } from './src/middlewares/invalidRoutes.middleware.js';
import { errorHandlerMiddleware } from './src/middlewares/errorHandler.js';
import usersRoutes from './src/features/user/routes/user.routes.js'
import homeRoutes from './src/features/home/routes/home.routes.js'
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import UserController from './src/features/user/controller/user.controller.js';
import HomeController from './src/features/home/controller/home.controller.js';
import './src/middlewares/googleAuth.js';


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // To parse data and put it in body object
app.use(cors()); // For providing access to all the Origins
app.use(bodyParser.urlencoded({ extended: false }));

// Logger middleware
app.use(loggerMiddleware);

// Cookie Session
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    // Cookie Options
    maxAge: 9 * 60 * 1000 // 9 minutes
}));

// Passport requirements
app.use(passport.initialize());
app.use(passport.session());

// Instance of classes
const userController = new UserController();
const homeController = new HomeController();

// For accessing public folder across project
app.use(express.static('public'));

// View Engine settings
app.set('view engine', 'ejs');
app.set('views', [
    path.join(path.resolve(), 'src', 'features', 'user', 'views'),
    path.join(path.resolve(), 'src', 'features', 'home', 'view')
]);
app.use(ejsLayouts);

// Routes
app.get('/', (req, res) => {
    userController.getSignIn(req, res)
});
app.use('/api/users', usersRoutes);
app.use('/api/home', homeRoutes);

// Google OAuth Routes
const isLoggedIn = (req, res, next) => {
    if(req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}
app.use('/googleapi/home', isLoggedIn, (req, res) => {
    homeController.home(req, res)
});
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/googleapi/home');
    }
);

// Invalid Routes Middleware
app.use(invalidRoutesHandlerMiddleware);

// App level Error Handler
app.use(errorHandlerMiddleware);

export default app;