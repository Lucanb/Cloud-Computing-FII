import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true
    },
    albumId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album',
        required: true
    },
    releaseDate: {
        type: Date,
        required: false
    },
    link: {
        type: String,
        required: false
    },
    duration: {
        type: Number,
        required: false
    }
},{timestamps : true});

module.exports = mongoose.model("song",songSchema);