import admin from "firebase-admin";

const firestore = admin.firestore();

class Album {
    constructor(title, year, artist, link) {
        this.title = title;
        this.year = year;
        this.artist = artist;
        this.link = link;
    }
}

const albumRepository = {
    // Adaugă un album nou
    async add(album) {
        try {
            await firestore.collection("albums").add(album);
            return true; // În caz de succes, returnează true
        } catch (error) {
            console.error("Error adding album:", error);
            return false; // În caz de eroare, returnează false
        }
    },

    // Obține toate albumele
    async getAll() {
        try {
            const snapshot = await firestore.collection("albums").get();
            const albums = [];
            snapshot.forEach(doc => {
                albums.push(doc.data());
            });
            return albums;
        } catch (error) {
            console.error("Error getting albums:", error);
            return []; // În caz de eroare, returnează un șir gol
        }
    },

    // Obține un album după ID
    async getById(albumId) {
        try {
            const doc = await firestore.collection("albums").doc(albumId).get();
            if (doc.exists) {
                return doc.data();
            } else {
                return null; // Dacă nu există albumul cu ID-ul dat, returnează null
            }
        } catch (error) {
            console.error("Error getting album:", error);
            return null; // În caz de eroare, returnează null
        }
    },

    // Șterge un album după ID
    async deleteById(albumId) {
        try {
            await firestore.collection("albums").doc(albumId).delete();
            return true; // În caz de succes, returnează true
        } catch (error) {
            console.error("Error deleting album:", error);
            return false; // În caz de eroare, returnează false
        }
    }
};

export default albumRepository;
