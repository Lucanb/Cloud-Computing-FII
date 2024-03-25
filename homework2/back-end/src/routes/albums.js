import express from "express";
import Album from "../model/album.js";
import Artist from "../model/artist.js";
import song from "../model/song.js";

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
    try {
        const allArtists = await Album.find();
        return res.json(allArtists);
    } catch (error) {
        return res.status(500).json({ success: false, msg: "A apărut o eroare la obținerea tuturor artiștilor." });
    }
});

router.get("/getOne/:id", async (req, res) => {
    const filter = { _id: req.params.id };

    try {
        const artist = await Album.findOne(filter);

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
        const albums = await Album.find();

        // Pentru fiecare album găsit
        for (const album of albums) {
            // Găsește și șterge toate melodiile asociate acestui album
            await song.deleteMany({ album: album._id });
        }
        await Album.deleteMany({});

        return res.status(200).json({ success: true, message: "Toate albumele și melodiile asociate au fost șterse cu succes." });
    } catch (error) {
        // În caz de eroare, returnează un mesaj de eroare
        return res.status(500).json({ success: false, message: "Eroare la ștergerea albumele și melodiilor asociate." });
    }
});
router.delete("/deleteOne/:id", async (req, res) => {
    const albumId = req.params.id;

    try {
        const album = await Album.findById(albumId);

        if (!album) {
            return res.status(404).json({ success: false, message: "Albumul nu a fost găsit." });
        }

        await song.deleteMany({ album: album._id });

        // Șterge albumul
        await Album.findByIdAndDelete(albumId);
        s
        return res.status(200).json({ success: true, message: "Albumul și melodiile asociate au fost șterse cu succes." });
    } catch (error) {
        // În caz de eroare, returnează un mesaj de eroare
        return res.status(500).json({ success: false, message: "Eroare la ștergerea albumului și melodiilor asociate." });
    }
});

router.put("/updateAll", async (req, res) => {
    const updatedData = req.body;

    try {
        const updatedArtists = await Album.updateMany({}, updatedData);
        if (!updatedArtists) {
            return res.status(404).json({ success: false, message: "Nu s-au găsit obiecte de actualizat." });
        }
        return res.status(200).json({ success: true, message: "Toate obiectele au fost actualizate cu succes." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Eroare la actualizarea obiectelor." });
    }
});

router.put("/updateOne/:id", async (req, res) => {
    const artistId = req.params.id;
    const updatedData = req.body;

    try {
        const updatedArtist = await Album.findByIdAndUpdate(artistId, updatedData, { new: true });
        if (!updatedArtist) {
            return res.status(404).json({ success: false, message: "Artistul nu a fost găsit." });
        }
        return res.status(200).json({ success: true, artist: updatedArtist });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Eroare la actualizarea artistului." });
    }
});

export default router;
