import express from "express";
import Album from "../model/album.js";
import Artist from "../model/artist.js";

const router = express.Router();

router.post("/save", async (req, res) => {
    try {
        const artist = await Artist.findOne({ name: req.body.artist });

        if (!artist) {
            return res.status(400).json({ success: false, msg: "Artistul nu a fost găsit." });
        }

        const existingAlbum = await Album.findOne({ title: req.body.title });
        if (existingAlbum) {
            return res.status(400).json({ success: false, msg: "Există deja un album cu acest titlu." });
        }

        const newAlbum = new Album({
            title: req.body.title,
            year: req.body.year,
            artist: req.body.artist,
            link: req.body.link
        });

        const savedAlbum = await newAlbum.save();
        return res.status(200).json({ success: true, album: savedAlbum });
    } catch (error) {
        return res.status(400).json({ success: false, msg: error.message });
    }
});

router.get("/getAll", async (req, res) => {
    return res.json({ message: "getting the songs" });
});

router.get("/getOne/:id", async (req, res) => {
    return res.json({ message: "getting the songs" });
});

export default router;
