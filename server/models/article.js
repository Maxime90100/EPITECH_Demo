import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    titre: String,
    contenu: String,
    datePublication: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Article = mongoose.model('Article', articleSchema);

export default Article;