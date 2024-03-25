import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    album: {
        type: String,
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

export default mongoose.model("song",songSchema);