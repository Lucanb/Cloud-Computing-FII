import express from "express";
import admin from "firebase-admin";
const router = express.Router();

const db = admin.firestore()

//cu firestore
router.post("/save/:userId", async (req, res) => {
    // Extrage datele albumului din corpul cererii
    const { title, year, artist, link } = req.body;
    const userId = req.params.userId;

    // Verifică dacă toate câmpurile necesare sunt definite și nu sunt undefined
    if (!title || !year || !artist || !link || !userId) {
        return res.status(400).json({ success: false, msg: "Toate câmpurile necesare trebuie să fie definite." });
    }

    try {
        // Verifică dacă există artistul în baza de date
            const artistSnapshot = await db.collection("artists")
            .where("name", "==", artist)
            .where("userId", "==", userId)
            .get();

        if (artistSnapshot.empty) {
            return res.status(400).json({ success: false, msg: "Artistul nu a fost găsit sau nu aparține utilizatorului specificat." });
        }

        // Verifică dacă există deja un album cu același nume
        const existingAlbumSnapshot = await db.collection("albums").where("title", "==", title).where("userId", "==", userId).get();
        if (!existingAlbumSnapshot.empty) {
            return res.status(400).json({ success: false, msg: "Există deja un album cu acest nume." });
        }

        // Creează un nou obiect pentru album
        const newAlbum = {
            title: title,
            year: year,
            link: link,
            artist: artist,
            userId: userId // Adaugă și ID-ul utilizatorului pentru asocierea albumului
        };

        // Adaugă albumul în colecția Firestore
        const albumRef = await db.collection("albums").add(newAlbum);
        const savedAlbumSnapshot = await albumRef.get();

        // Returnează răspunsul de succes și albumul salvat
        return res.status(200).json({ success: true, album: savedAlbumSnapshot.data() });
    } catch (error) {
        // În caz de eroare, returnează un mesaj de eroare și un cod de stare 400
        return res.status(400).json({ success: false, msg: error.message });
    }
});


router.get("/getAll/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const albumsSnapshot = await db.collection("albums").where("userId", "==", userId).get();
        const allAlbums = [];

        albumsSnapshot.forEach(albumDoc => {
            const albumId = albumDoc.id;
            const albumData = albumDoc.data();
            albumData._id = albumId;
            allAlbums.push(albumData);
        });

        return res.status(200).json(allAlbums);
    } catch (error) {
        return res.status(500).json({ success: false, msg: "A apărut o eroare la obținerea tuturor albumelelor." });
    }
});

router.get("/getOne/:id/:userId", async (req, res) => {
    const id = req.params.id;
    const userId = req.params.userId;

    try {
        const albumDoc = await db.collection("albums").doc(id).get();

        if (albumDoc.exists && albumDoc.data().userId === userId) {
            const albumData = albumDoc.data();
            const albumWithId = { _id: albumDoc.id, ...albumData };
            return res.status(200).json({ success: true, album: albumWithId });
        } else {
            return res.status(400).json({ success: false, message: "Albumul nu a fost găsit." });
        }
    } catch (error) {
        return res.status(400).json({ success: false, msg: error.message });
    }
});

router.get("/getAlbumsByArtist/:nameArtist/:userId", async (req, res) => {
    const nameArtist = req.params.nameArtist;
    const userId = req.params.userId;

    try {
        const querySnapshot = await db.collection("albums").where("artist", "==", nameArtist).where("userId", "==", userId).get();

        if (!querySnapshot.empty) {
            const albums = [];

            querySnapshot.forEach(doc => {
                albums.push({ _id: doc.id, ...doc.data() });
            });

            return res.status(200).json({ success: true, albums: albums });
        } else {
            return res.status(400).json({ success: false, message: "Nu s-au găsit albume pentru acest artist." });
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
});

router.delete("/deleteAll/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        const querySnapshot = await db.collection("albums").where("userId", "==", userId).get();

        if (!querySnapshot.empty) {
            const albumIds = [];

            querySnapshot.forEach(doc => {
                albumIds.push(doc.id);
            });

            for (const albumId of albumIds) {
                await db.collection("albums").doc(albumId).delete();
            }

            return res.status(200).json({ success: true, message: "Toate albumele au fost șterse cu succes." });
        } else {
            return res.status(404).json({ success: false, message: "Nu există albume de șters." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Eroare la ștergerea albumelelor." });
    }
});

router.delete("/deleteOne/:id/:userId", async (req, res) => {
    const albumId = req.params.id;
    const userId = req.params.userId;

    try {
        const albumRef = db.collection("albums").doc(albumId);
        const albumDoc = await albumRef.get();

        if (!albumDoc.exists || albumDoc.data().userId !== userId) {
            return res.status(404).json({ success: false, message: "Albumul nu a fost găsit sau nu aparține utilizatorului specificat." });
        }

        await albumRef.delete();

        return res.status(200).json({ success: true, message: "Albumul a fost șters cu succes." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Eroare la ștergerea albumului." });
    }
});

router.put("/updateAll/:userId", async (req, res) => {
    const userId = req.params.userId;
    const updatedData = req.body;

    try {
        const albumsRef = db.collection("albums");
        const snapshot = await albumsRef.where("userId", "==", userId).get();

        const batch = db.batch();
        snapshot.forEach(doc => {
            const albumRef = albumsRef.doc(doc.id);
            batch.update(albumRef, updatedData);
        });

        await batch.commit();

        return res.status(200).json({ success: true, message: "Toate albumele au fost actualizate cu succes." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Eroare la actualizarea albumelelor." });
    }
});

router.put("/updateOne/:id/:userId", async (req, res) => {
    const albumId = req.params.id;
    const userId = req.params.userId;
    const updatedData = req.body;

    try {
        const albumRef = db.collection("albums").doc(albumId);
        const albumDoc = await albumRef.get();

        if (!albumDoc.exists || albumDoc.data().userId !== userId) {
            return res.status(404).json({ success: false, message: "Albumul nu a fost găsit sau nu aparține utilizatorului specificat." });
        }

        await albumRef.update(updatedData);

        return res.status(200).json({ success: true, message: "Albumul a fost actualizat cu succes." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Eroare la actualizarea albumului." });
    }
});


export default router;
