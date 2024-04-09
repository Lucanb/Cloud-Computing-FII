import express from "express";
import admin from "firebase-admin";

const router = express.Router();

const db = admin.firestore()

router.post("/save/:userId", async (req, res) => {
    // Extrage id-ul utilizatorului din parametrul rutei și datele artistului din corpul cererii
    const userId = req.params.userId;
    const { name, description, members, link } = req.body;

    try {
        const newArtist = {
            name: name,
            description: description,
            members: members,
            link: link,
            userId: userId // Adaugă id-ul utilizatorului la datele artistului
        };

        // Salvează artistul cu id-ul specificat în colecția Firestore
        const artistRef = await db.collection('artists').add(newArtist);

        // Returnează artistul salvat
        return res.status(200).json({ success: true, artist: newArtist });
    } catch (error) {
        return res.status(400).json({ success: false, msg: error.message });
    }
});

//cu fiebase

router.get("/getAll/:userId", async (req, res) => {
    try {
        const userId = req.params.userId; // Obține id-ul din URL

        // Obține toți artiștii din colecția Firestore care au id-ul specificat
        const querySnapshot = await db.collection('artists').where("userId", "==", userId).get();
        const allArtists = querySnapshot.docs.map(doc => {
            const artistData = doc.data();
            // Încorporează ID-ul artistului în datele artistului
            return { _id: doc.id, ...artistData };
        });

        // Returnează lista de artiști care au id-ul specificat
        return res.json(allArtists);
    } catch (error) {
        // În caz de eroare, returnează un mesaj de eroare și un cod de stare 500
        return res.status(500).json({ success: false, msg: "A apărut o eroare la obținerea tuturor artiștilor." });
    }
});

//cu firebase

router.get("/getOne/:artistId/:userId", async (req, res) => {
    const artistId = req.params.artistId;
    const userId = req.params.userId;

    try {
        // Obține referința către colecția de artiști și aplică filtrarea după userId
        const artistRef = db.collection('artists').where("userId", "==", userId);

        // Obține datele artistului folosind artistId-ul specific
        const querySnapshot = await artistRef.get();

        // Verifică dacă există vreun artist care corespunde criteriilor de căutare
        let artistData;
        querySnapshot.forEach(doc => {
            if (doc.id === artistId) {
                artistData = doc.data();
            }
        });

        if (artistData) {
            // Returnează răspunsul cu datele artistului și un cod de stare 200 (OK)
            return res.status(200).json({ success: true, artist: artistData });
        } else {
            // Returnează un mesaj de eroare și un cod de stare 400 (Not Found) dacă artistul nu există
            return res.status(400).json({ success: false, message: "Artistul nu a fost găsit." });
        }
    } catch (error) {
        // În caz de eroare, returnează un mesaj de eroare și un cod de stare 400 (Bad Request)
        return res.status(400).json({ success: false, msg: error.message });
    }
});


//cu firebase
router.delete("/deleteOne/:artistId/:userId", async (req, res) => {
    const artistId = req.params.artistId;
    const userId = req.params.userId;

    try {
        // Obține referința către documentul artistului
        const artistRef = db.collection('artists').doc(artistId);

        // Obține datele artistului pentru a verifica dacă există și dacă aparține user-ului specificat
        const artistDoc = await artistRef.get();

        // Verifică dacă artistul există și aparține user-ului specificat
        if (!artistDoc.exists || artistDoc.data().userId !== userId) {
            return res.status(404).json({ success: false, message: "Artistul nu a fost găsit sau nu aparține utilizatorului specificat." });
        }

        // Șterge documentul artistului
        await artistRef.delete();

        // Returnează un răspuns de succes și un cod de stare 200 (OK)
        return res.status(200).json({ success: true, message: "Artistul a fost șters cu succes." });
    } catch (error) {
        // În caz de eroare, returnează un mesaj de eroare și un cod de stare 500 (Internal Server Error)
        return res.status(500).json({ success: false, message: "Eroare la ștergerea artistului." });
    }
});
//cu fiebase
router.delete("/deleteAll/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        // Obține referința către colecția de artiști care aparțin utilizatorului specificat
        const artistsRef = db.collection('artists').where("userId", "==", userId);

        // Obține toate documentele din colecție care aparțin utilizatorului specificat
        const querySnapshot = await artistsRef.get();

        // Verifică dacă există artiști care să aparțină utilizatorului specificat
        if (querySnapshot.empty) {
            return res.status(404).json({ success: false, message: "Nu există artiști care să aparțină utilizatorului specificat." });
        }

        // Șterge toți artiștii care aparțin utilizatorului specificat
        querySnapshot.forEach(async (doc) => {
            await doc.ref.delete();
        });

        // Returnează un răspuns de succes și un cod de stare 200 (OK)
        return res.status(200).json({ success: true, message: "Toți artiștii au fost șterși cu succes." });
    } catch (error) {
        // În caz de eroare, returnează un mesaj de eroare și un cod de stare 500 (Internal Server Error)
        return res.status(500).json({ success: false, message: "Eroare la ștergerea artiștilor." });
    }
});

router.put("/updateAll/:userId", async (req, res) => {
    const userId = req.params.userId;
    const updatedData = req.body;

    try {
        // Obține referința către colecția de artiști care aparțin utilizatorului specificat
        const artistsRef = db.collection('artists').where("userId", "==", userId);

        // Obține toate documentele din colecție care aparțin utilizatorului specificat
        const querySnapshot = await artistsRef.get();

        // Verifică dacă există artiști care să aparțină utilizatorului specificat
        if (querySnapshot.empty) {
            return res.status(404).json({ success: false, message: "Nu există artiști care să aparțină utilizatorului specificat." });
        }

        // Actualizează toți artiștii care aparțin utilizatorului specificat cu datele primite
        querySnapshot.forEach(async (doc) => {
            await doc.ref.update(updatedData);
        });

        // Returnează un răspuns de succes și un cod de stare 200 (OK)
        return res.status(200).json({ success: true, message: "Toți artiștii au fost actualizați cu succes." });
    } catch (error) {
        // În caz de eroare, returnează un mesaj de eroare și un cod de stare 500 (Internal Server Error)
        return res.status(500).json({ success: false, message: "Eroare la actualizarea artiștilor." });
    }
});

router.put("/updateOne/:id/:userId", async (req, res) => {
    const artistId = req.params.id;
    const userId = req.params.userId;
    const updatedData = req.body;

    try {
        // Obține referința către documentul artistului
        const artistRef = db.collection('artists').doc(artistId);

        // Obține datele artistului pentru a verifica dacă există și aparține user-ului specificat
        const artistDoc = await artistRef.get();

        // Verifică dacă artistul există și aparține user-ului specificat
        if (!artistDoc.exists || artistDoc.data().userId !== userId) {
            return res.status(404).json({ success: false, message: "Artistul nu a fost găsit sau nu aparține utilizatorului specificat." });
        }

        // Actualizează documentul artistului cu datele primite
        await artistRef.update(updatedData);

        // Returnează un răspuns de succes și un cod de stare 200 (OK)
        return res.status(200).json({ success: true, message: "Artistul a fost actualizat cu succes." });
    } catch (error) {
        // În caz de eroare, returnează un mesaj de eroare și un cod de stare 500 (Internal Server Error)
        return res.status(500).json({ success: false, message: "Eroare la actualizarea artistului." });
    }
});

export default router;