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
    artist: {
        type: String,
        required: true
    },
    link:{
        type: String,
        required: false
    }
},{timestamps : true});

export default mongoose.model("album",albumSchema);