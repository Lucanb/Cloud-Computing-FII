
import admin from "firebase-admin";

const firestore = admin.firestore();

class Artist {
    constructor(name, description, members, link) {
        this.name = name;
        this.description = description;
        this.members = members;
        this.link = link;
    }
}


const artistRepository = {
    // Adaugă un artist nou
    async add(artist) {
        try {
            await firestore.collection("artists").add(artist);
            return true; // În caz de succes, returnează true
        } catch (error) {
            console.error("Error adding artist:", error);
            return false; // În caz de eroare, returnează false
        }
    },

    // Obține toți artiștii
    async getAll() {
        try {
            const snapshot = await firestore.collection("artists").get();
            const artists = [];
            snapshot.forEach(doc => {
                artists.push(doc.data());
            });
            return artists;
        } catch (error) {
            console.error("Error getting artists:", error);
            return []; // În caz de eroare, returnează un șir gol
        }
    },

    // Obține un artist după ID
    async getById(artistId) {
        try {
            const doc = await firestore.collection("artists").doc(artistId).get();
            if (doc.exists) {
                return doc.data();
            } else {
                return null; // Dacă nu există artistul cu ID-ul dat, returnează null
            }
        } catch (error) {
            console.error("Error getting artist:", error);
            return null; // În caz de eroare, returnează null
        }
    },

    // Șterge un artist după ID
    async deleteById(artistId) {
        try {
            await firestore.collection("artists").doc(artistId).delete();
            return true; // În caz de succes, returnează true
        } catch (error) {
            console.error("Error deleting artist:", error);
            return false; // În caz de eroare, returnează false
        }
    }
};

export default artistRepository;