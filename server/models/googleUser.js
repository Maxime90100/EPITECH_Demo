import mongoose from 'mongoose';

const googleUserSchema = new mongoose.Schema({
    googleId: String,
    email: String,
    familyName: String,
    givenName: String,
    photo: String,
});

googleUserSchema.statics.findOrCreate = async function (query) {
    try {
        const User = this;
        let user = await User.findOne(query);

        if (user) {
            return user;
        } else {
            user = await User.create({
                googleId: query.googleId,
                email: query.email,
                familyName: query.familyName,
                givenName: query.givenName,
                photo: query.photo,
            });

            return user;
        }
    } catch (error) {
        throw error;
    }
};

const googleUser = mongoose.model('googleUser', googleUserSchema);

export default googleUser;