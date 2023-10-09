import express from "express";
import jwt from "jsonwebtoken";

const authenticateRouter = express.Router();

authenticateRouter.get('/',async (req, res,next) => {
    const getUser = !!req.query.user;
    const token = req.header('Authorization');
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Token manquant ou invalide' });
    }
    const tokenValue = token.slice(7);
    req.token = tokenValue;
    try {
        const decodedToken = jwt.verify(tokenValue, process.env.JWT_SECRET);
        if(getUser) res.status(200).send({data:decodedToken.user,message:'Utilisateur connecté'});
        else next();
    } catch (error) {
        console.error(error);
        if (error.name === 'TokenExpiredError') {
            res.status(401).send({ message: 'Le token JWT a expiré' });
        } else if (error.name === 'JsonWebTokenError') {
            res.status(401).send({ message: 'Token JWT invalide' });
        } else {
            res.status(401).send({ message: 'Erreur de vérification du token JWT' });
        }
    }
});
export default authenticateRouter;