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
    try {
        const allArtists = await song.find();
        return res.json(allArtists);
    } catch (error) {
        return res.status(500).json({ success: false, msg: "A apărut o eroare la obținerea tuturor artiștilor." });
    }
});

router.get("/getOne/:id", async (req, res) => {
    const filter = { _id: req.params.id };

    try {
        const artist = await song.findOne(filter);

        if (artist) {
            return res.status(200).send({succes : true,artist : artist});
        } else {
            return res.status(400).json({ success: false ,message: "Artistul nu a fost găsit." });
        }
    } catch (error) {
        return res.status(400).json({ success: false, msg: error.message });
    }
});

router.delete("/deleteAll", async (req, res) => {
    try {
        const deletedArtists = await song.deleteMany({});
        if (!deletedArtists) {
            return res.status(404).json({ success: false, message: "Nu s-au găsit obiecte de șters." });
        }
        return res.status(200).json({ success: true, message: "Toate obiectele au fost șterse cu succes." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Eroare la ștergerea obiectelor." });
    }
});
router.delete("/deleteOne/:id", async (req, res) => {
    const artistId = req.params.id;

    try {
        const artist = await Artist.findById(artistId);
        if (!artist) {
            return res.status(404).json({ success: false, message: "Artistul nu a fost găsit." });
        }

        const songs = await song.find({ artist: artistId });
        if (songs.length > 0) {
            await song.deleteMany({ artist: artistId });
        }

        const albums = await Album.find({ artist: artistId });
        if (albums.length > 0) {
            for (const album of albums) {
                await song.deleteMany({ album: album._id });
            }
            await Album.deleteMany({ artist: artistId });
        }

        // Șterge artistul
        await Artist.findByIdAndDelete(artistId);

        return res.status(200).json({ success: true, message: "Artistul și toate datele asociate au fost șterse cu succes." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Eroare la ștergerea artistului și a datelor asociate." });
    }
});


router.delete("/deleteAll", async (req, res) => {
    try {
        await Song.deleteMany({});

        await Album.deleteMany({});

        await Artist.deleteMany({});

        return res.status(200).json({ success: true, message: "Toate obiectele și datele asociate au fost șterse cu succes." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Eroare la ștergerea obiectelor și a datelor asociate." });
    }
});

router.put("/updateOne/:id", async (req, res) => {
    const artistId = req.params.id;
    const updatedData = req.body;

    try {
        const updatedArtist = await song.findByIdAndUpdate(artistId, updatedData, { new: true });
        if (!updatedArtist) {
            return res.status(404).json({ success: false, message: "Artistul nu a fost găsit." });
        }
        return res.status(200).json({ success: true, artist: updatedArtist });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Eroare la actualizarea artistului." });
    }
});
export default router;
