import express from "express";
import dotenv from "dotenv";
import Blog from "../../models/blog.js";

dotenv.config();

const blogRouter = express.Router();

blogRouter.get('/:id?', async (req, res) => {
    try {
        const idBlog = req.params.id;
        const other = req.query.other;
        let blogs = [];
        if(idBlog){
            blogs = (await Blog
                .find({ _id: idBlog })
                .populate('user')
                .populate({
                    path: 'messages',
                    populate: {
                        path: 'user',
                        model: 'User',
                    }
                })
            )[0];
        } else {
            const find = other ? { user: { $ne: req.user }} : { user: req.user };
            blogs = await Blog
                .find(find)
                .populate('user')
                .populate({
                    path: 'messages',
                    populate: {
                        path: 'user',
                        model: 'User',
                    }
                });
        }
        res.status(200).send(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Une erreur est survenue lors de la récupération des blogs' });
    }
});

blogRouter.post('/add', async (req, res) => {
    try {
        const {title, description, color} = req.body;
        const newBlog = new Blog({
            user:req.user,
            title:title,
            description:description,
            color:color,
        });
        await newBlog.save();
        res.status(201).send({message: 'Blog ajouté avec succès', blog: newBlog});
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Une erreur est survenue lors de l\'ajout du blog'});
    }
});

blogRouter.delete('/delete/:id', async (req, res) => {
    try {
        const blogId = req.params.id;
        const deletedBlog = await Blog.findByIdAndRemove(blogId);
        if (!deletedBlog) {
            return res.status(404).send({ message: 'Blog non trouvé' });
        }
        res.status(200).send({ message: 'Blog supprimé avec succès', blog: deletedBlog });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Une erreur est survenue lors de la suppression du blog' });
    }
});

blogRouter.post('/addMessage', async (req, res) => {
    try {
        const blogId = req.query.idBlog;
        const { text } = req.body;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).send({ message: 'Blog non trouvé' });
        }

        blog.messages.push({
            user: req.user,
            text: text,
        });
        await blog.save();
        res.status(201).send(blog);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Une erreur est survenue lors de l\'ajout du message' });
    }
});
export default blogRouter;