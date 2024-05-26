const { MongoClient, ObjectId } = require('mongodb');
const { app } = require('@azure/functions');

const uri = "mongodb://music-bd:uLA9TkuZyGtEgw9HOhXMfSIlOIvhPXjpOsLjEv5HNbLtUjRn0BLFv20ngtXAq2RWzhtWqfbWsT3xACDbU4Q1vA%3D%3D@music-bd.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@music-bd@";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        return client.db("test");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        throw err;
    }
}

async function updatePlaylist(partyId, songId, add = true) {
    const db = await connectToDatabase();
    if(add) {
        await db.collection("party").updateOne({ _id: new ObjectId(partyId) }, { $push: { playlist: songId } });
    } else {
        await db.collection("party").updateOne({ _id: new ObjectId(partyId) }, { $pull: { playlist: songId } });
    }
}

async function updateGuestList(partyId, guestId, add = true) {
    const db = await connectToDatabase();
    if(add) {
        await db.collection("party").updateOne({ _id: new ObjectId(partyId) }, { $push: { guests: guestId } });
    } else {
        await db.collection("party").updateOne({ _id: new ObjectId(partyId) }, { $pull: { guests: guestId } });
    }
}

app.http('update-playlist', {
    methods: ['POST'],
    route: 'party/update-playlist',
    handler: async (request, context) => {
        const { partyId, songId, add } = JSON.parse(await request.text());
        if (!partyId || !songId) {
            return { status: 400, body: JSON.stringify({ message: "Party ID and Song ID are required" }) };
        }
        try {
            await updatePlaylist(partyId, songId, add);
            return { status: 200, body: JSON.stringify({ message: "Playlist updated successfully" }) };
        } catch (error) {
            console.error("Error updating playlist:", error);
            return { status: 500, body: JSON.stringify({ message: "Internal Server Error", error: error.message }) };
        }
    }
});

app.http('update-guest-list', {
    methods: ['POST'],
    route: 'party/update-guest-list',
    handler: async (request, context) => {
        const { partyId, guestId, add } = JSON.parse(await request.text());

        if (!partyId || !guestId) {
            return { status: 400, body: JSON.stringify({ message: "Party ID and Guest ID are required" }) };
        }

        try {
            await updateGuestList(partyId, guestId, add);
            return { status: 200, body: JSON.stringify({ message: "Guest list updated successfully" }) };
        } catch (error) {
            console.error("Error updating guest list:", error);
            return { status: 500, body: JSON.stringify({ message: "Internal Server Error", error: error.message }) };
        }
    }
});
