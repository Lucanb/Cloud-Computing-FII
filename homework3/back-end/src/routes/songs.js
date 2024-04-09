import express from "express";
import admin from "firebase-admin";
import songRepository from "../model/song.js";
const db = admin.firestore()

const router = express.Router();


router.post("/save/:userId", async (req, res) => {
    const userId = req.params.userId;
    const { title, artist, album, releaseDate, link, duration } = req.body;

    try {
        const newSong = {
            title: title,
            artist: artist,
            album: album,
            releaseDate: releaseDate,
            link: link,
            duration: duration,
            userId: userId // Adaugă id-ul utilizatorului la datele melodiei
        };

        const artistSnapshot = await db.collection("artists").where("name", "==", artist).get();
        const albumSnapshot = await db.collection("albums").where("title", "==", album).where("userId", "==", userId).get();
        const existingSong = await db.collection("songs").where("title", "==", title).where("userId", "==", userId).get();

        if (existingSong.size > 0) {
            return res.status(400).json({ success: false, msg: "Există deja o melodie cu acest titlu." });
        }

        if (artistSnapshot.empty) {
            return res.status(400).json({ success: false, msg: "Artistul nu a fost găsit." });
        }

        if (albumSnapshot.empty) {
            return res.status(400).json({ success: false, msg: "Albumul nu a fost găsit." });
        }

        await db.collection("songs").add(newSong);
        return res.status(200).json({ success: true, song: newSong });
    } catch (error) {
        return res.status(400).json({ success: false, msg: error.message });
    }
});

router.get("/getAll/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        const snapshot = await db.collection("songs").where("userId", "==", userId).get();
        const allSongs = [];
        snapshot.forEach(doc => {
            allSongs.push({ _id: doc.id, ...doc.data() });
        });
        return res.json(allSongs);
    } catch (error) {
        console.error("Error getting all songs:", error);
        return res.status(500).json({ success: false, msg: "A apărut o eroare la obținerea tuturor cântecelor." });
    }
});

router.get("/getOne/:id/:userId", async (req, res) => {
    const songId = req.params.id;
    const userId = req.params.userId;

    try {
        const doc = await db.collection("songs").doc(songId).get();

        if (doc.exists && doc.data().userId === userId) {
            const songData = doc.data();
            return res.status(200).json({ success: true, song: { _id: doc.id, ...songData } });
        } else {
            return res.status(400).json({ success: false, message: "Cântecul nu a fost găsit sau nu aparține utilizatorului specificat." });
        }
    } catch (error) {
        console.error("Error getting song:", error);
        return res.status(500).json({ success: false, message: "Eroare la obținerea cântecului." });
    }
});

router.get("/getSongsByAlbum/:nameAlbum/:userId", async (req, res) => {
    const nameAlbum = req.params.nameAlbum;
    const userId = req.params.userId;

    try {
        const querySnapshot = await db.collection("songs").where("album", "==", nameAlbum).where("userId", "==", userId).get();

        if (!querySnapshot.empty) {
            const songs = [];

            querySnapshot.forEach(doc => {
                songs.push({ _id: doc.id, ...doc.data() });
            });

            return res.status(200).json({ success: true, songs: songs });
        } else {
            return res.status(400).json({ success: false, message: "Nu s-au găsit melodii pentru acest album." });
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
});

router.delete("/deleteOne/:id/:userId", async (req, res) => {
    const songId = req.params.id;
    const userId = req.params.userId;

    try {
        const doc = await db.collection("songs").doc(songId).get();

        if (!doc.exists || doc.data().userId !== userId) {
            return res.status(404).json({ success: false, message: "Cântecul nu a fost găsit sau nu aparține utilizatorului specificat." });
        }

        await db.collection("songs").doc(songId).delete();

        return res.status(200).json({ success: true, message: "Cântecul a fost șters cu succes." });
    } catch (error) {
        console.error("Error deleting song:", error);
        return res.status(500).json({ success: false, message: "Eroare la ștergerea cântecului." });
    }
});

router.put("/updateOne/:id/:userId", async (req, res) => {
    const songId = req.params.id;
    const userId = req.params.userId;
    const updatedData = req.body;

    try {
        const songRef = db.collection("songs").doc(songId);
        const songDoc = await songRef.get();

        if (!songDoc.exists || songDoc.data().userId !== userId) {
            return res.status(404).json({ success: false, message: "Cântecul nu a fost găsit sau nu aparține utilizatorului specificat." });
        }

        await songRef.update(updatedData);
        const updatedSongDoc = await songRef.get();
        const updatedSong = updatedSongDoc.data();

        return res.status(200).json({ success: true, song: updatedSong });
    } catch (error) {
        console.error("Error updating song:", error);
        return res.status(500).json({ success: false, message: "Eroare la actualizarea cântecului." });
    }
});
export default router;
