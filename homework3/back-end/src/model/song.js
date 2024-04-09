import admin from "firebase-admin";

const firestore = admin.firestore();

class Song {
    constructor(title, artist, album, releaseDate, link, duration) {
        this.title = title;
        this.artist = artist;
        this.album = album;
        this.releaseDate = releaseDate;
        this.link = link;
        this.duration = duration;
    }
}

const songRepository = {
    // Adaugă un cântec nou
    async add(song) {
        try {
            await firestore.collection("songs").add(song);
            return true; // În caz de succes, returnează true
        } catch (error) {
            console.error("Error adding song:", error);
            return false; // În caz de eroare, returnează false
        }
    },

    // Obține toate cântecele
    async getAll() {
        try {
            const snapshot = await firestore.collection("songs").get();
            const songs = [];
            snapshot.forEach(doc => {
                songs.push({ id: doc.id, ...doc.data() });
            });
            return songs;
        } catch (error) {
            console.error("Error getting songs:", error);
            return []; // În caz de eroare, returnează un șir gol
        }
    },

    // Obține un cântec după ID
    async getById(songId) {
        try {
            const doc = await firestore.collection("songs").doc(songId).get();
            if (doc.exists) {
                return { id: doc.id, ...doc.data() };
            } else {
                return null; // Dacă nu există cântecul cu ID-ul dat, returnează null
            }
        } catch (error) {
            console.error("Error getting song:", error);
            return null; // În caz de eroare, returnează null
        }
    },

    // Șterge un cântec după ID
    async deleteById(songId) {
        try {
            await firestore.collection("songs").doc(songId).delete();
            return true; // În caz de succes, returnează true
        } catch (error) {
            console.error("Error deleting song:", error);
            return false; // În caz de eroare, returnează false
        }
    }
};

export default songRepository;
