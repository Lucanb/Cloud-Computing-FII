import mongoose from "mongoose";


const userArtistSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    }
},{timestamps : true});

module.exports = mongoose.model("user",userArtistSchema);