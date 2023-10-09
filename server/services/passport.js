import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import {fileURLToPath} from "url";
import path from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

import googleUser from '../models/googleUser.js';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            proxy: true,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await googleUser.findOrCreate({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    familyName: profile.name.familyName,
                    givenName: profile.name.givenName,
                    photo: profile.photos[0].value
                });
                return done(null, user);
            } catch (err) {
                console.error(err);
                return done(err, null);
            }
        }
    )
);


passport.serializeUser(function(user, done) {
    console.log('serialize')
    done(null, user.id);
});


passport.deserializeUser(async function (id, done) {
    console.log('deserialize')
    try {
        const user = await googleUser.findOne({id: id});
        return done(null, user);
    } catch (err) {
        console.error(err);
        return done(err, null);
    }
});

export default passport;