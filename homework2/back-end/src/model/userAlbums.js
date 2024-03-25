import mongoose from "mongoose";


const userArtistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    artistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true
    }
},{timestamps : true});

module.exports = mongoose.model("user",userArtistSchema);