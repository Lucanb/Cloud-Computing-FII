import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type : mongoose.Schema.Types.Mixed,
        required: true
    },
    members: {
        type: [String],
        required: true
    },
    link:{
        type: String,
        required: false
    }
},{timestamps : true});

module.exports = mongoose.model("artist",artistSchema);