import express from "express";
import song from "../model/song.js";
import Artist from "../model/artist.js";
import Album from "../model/album.js";

const router = express.Router();


router.post("/save", async (req, res) => {
    const newSong = new song({
        title: req.body.title,
        artist: req.body.artist,
        album: req.body.album,
        releaseDate: req.body.releaseDate,
        link: req.body.link,
        duration: req.body.duration
    });

    try {
        const artist = await Artist.findOne({ name: req.body.artist });
        const album = await Album.findOne({ title: req.body.album });
        const existingSong = await song.findOne({ title: req.body.title });

        if (existingSong) {
            return res.status(400).json({ success: false, msg: "Există deja o melodie cu acest titlu." });
        }

        if (!artist) {
            return res.status(400).json({ success: false, msg: "Artistul nu a fost   găsit." });
        }

        if (!album) {
            return res.status(400).json({ success: false, msg: "Albumul nu a fost găsit." });
        }

        // newSong.artist = artist._id;
        // newSong.album = album._id;

        const savedSong = await newSong.save();
        return res.status(200).json({ success: true, song: savedSong });
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
