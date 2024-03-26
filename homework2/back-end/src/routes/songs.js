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

router.get("/getSongsByAlbum/:nameAlbum", async (req, res) => {
    const filter = { album: req.params.nameAlbum };

    try {
        const songs = await song.find(filter);

        if (songs.length > 0) {
            return res.status(200).json({ success: true, songs: songs });
        } else {
            return res.status(400).json({ success: false, message: "Nu s-au găsit melodii pentru acest album." });
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
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
    const songId = req.params.id;

    try {
        const existingSong = await song.findById(songId);
        if (!existingSong) {
            return res.status(404).json({ success: false, message: "Melodia nu a fost găsită." });
        } else {
            await song.findByIdAndDelete(songId);
            return res.status(200).json({ success: true, message: "Melodia a fost ștearsă cu succes." });
        }
    } catch (error) {
        console.error("Eroare la ștergerea melodiei:", error);
        return res.status(500).json({ success: false, message: "Eroare la ștergerea melodiei." });
    }
});


router.delete("/deleteAll", async (req, res) => {
    try {
        await song.deleteMany({});

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
