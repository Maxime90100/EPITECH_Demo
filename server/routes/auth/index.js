import express from "express";
import googleAuthRouter from "./google-auth.js";
import User from "../../models/user.js";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";

const authRouter = express.Router();

authRouter.post('/login',async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username:username }).exec();
        if (!user) {
            res.status(400).send({ message: 'Utilisateur introuvable' });
        } else {
            const decrypt = await bcrypt.compare(password, user.password);
            if (decrypt) {
                // Passwords match
                const token = jwt.sign({ user:user }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.status(200).send({
                    token: token,
                    message: 'Utilisateur connecté'
                });
            } else {
                // Passwords don't match
                res.status(400).send({message: 'Mot de passe incorrect'});
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal server error' });
    }
});

authRouter.post('/register', async (req, res) => {
    const {username, password} = req.body;
    try {
        const existingUser = await User.findOne({username: username}).exec()
        if (existingUser) {
            res.status(400).send({message: 'Utilisateur existant'});
        } else {
            const cryptedPassword = await bcrypt.hash(password, 10)
            const newUser = new User({
                username: username,
                password: cryptedPassword
            });
            await newUser.save();
            res.status(201).send({ message: 'Utilisateur enregistré' });
        }
    } catch (err) {
        console.error(err)
        res.status(500).send({message: 'Internal server error'});
    }
});

authRouter.use('/google',googleAuthRouter);
export default authRouter;