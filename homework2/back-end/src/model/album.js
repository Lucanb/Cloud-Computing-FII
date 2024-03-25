import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    year: {
        type : Date,
        required: true
    },
    artistId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    link:{
        type: String,
        required: false
    }
},{timestamps : true});

module.exports = mongoose.model("album",albumSchema);