import express from "express";
import dotenv from "dotenv";
import Article from "../models/article.js"

dotenv.config();

const blogRouter = express.Router();

blogRouter.get('/', (req, res) => {
    Article.find({}, (err, articles) => {
        if (err) {
            res.send({error:1, data:err});
        } else {
            res.send({error:0, data:articles});
        }
    });
});
export default blogRouter;