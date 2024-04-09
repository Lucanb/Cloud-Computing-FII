import mongoose from "mongoose";


const userAlbumSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    albumId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album',
        required: true
    }
},{timestamps : true});

module.exports = mongoose.model("user",userAlbumSchema);