import dotenv from 'dotenv';
dotenv.config();

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { UserModel } from '../features/user/model/user.schema.js';
import { hashPassword } from "../utils/hashPassword.js";
import { sendMail } from "../utils/mailer.js";

passport.serializeUser((user, done) => {
    done(null, user)
});

passport.deserializeUser((user, done) => {
    done(null, user)
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALL_BACK_URL
    },
    async function(accessToken, refreshToken, profile, done) {
        console.log("profile.id: " + JSON.stringify(profile));
        // return done(null, profile);
        const user = await UserModel.findOne({ email: profile.email });
        console.log("user: " + user);
        if(user) {
            console.log("user: " + user);
            return done(null, profile);
        } else {
            const password = profile._json.email + profile.id;
            const hashedPassword = await hashPassword(password, next);
            const newUser = await UserModel.create({ email: profile._json.email, password: hashedPassword});
            await sendMail("WELCOME", email);
            return done(null, profile);
        }
        // const user = await UserModel.findOrCreate({ email: profile.id }, function (err, user) {
        //     return done(err, user);
        // });
    }
));