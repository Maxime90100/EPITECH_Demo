import mongoose from 'mongoose';
import moment from "moment-timezone";

const messageSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: () => moment().format() },
});

const blogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    description: String,
    color: String,
    messages:[messageSchema]
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;