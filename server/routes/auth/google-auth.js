import express from "express";
import dotenv from "dotenv";
import passport from "../../services/passport.js";

dotenv.config();

const googleAuthRouter = express.Router();
let originalPageURL = '/';
googleAuthRouter.get('/', (req, res, next)=> {
        originalPageURL = req.query.originalPageURL || '/';
        next();
    },
    passport.authenticate(
        'google',
        { scope: ['profile','email']
        }
    )
)
googleAuthRouter.get('/callback',
    passport.authenticate(
        'google',
        { failureRedirect: originalPageURL }
    ),
    async (req, res) => {
        console.log(req.user)
        res.redirect(originalPageURL);
    }
)

export default googleAuthRouter;