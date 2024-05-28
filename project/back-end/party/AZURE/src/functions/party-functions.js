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
    if (add) {
        await db.collection("party").updateOne({ _id: new ObjectId(partyId) }, { $push: { playlist: songId } });
    } else {
        await db.collection("party").updateOne({ _id: new ObjectId(partyId) }, { $pull: { playlist: songId } });
    }
}

async function deleteFromPlaylistBySongId(partyId, songId) {
    const db = await connectToDatabase();
    await db.collection("party").updateOne({ _id: new ObjectId(partyId) }, { $pull: { playlist: songId } });
}

async function updateGuestList(partyId, guestId, add = true) {
    const db = await connectToDatabase();
    if (add) {
        await db.collection("party").updateOne({ _id: new ObjectId(partyId) }, { $push: { guests: guestId } });
    } else {
        await db.collection("party").updateOne({ _id: new ObjectId(partyId) }, { $pull: { guests: guestId } });
    }
}

async function getPartyById(partyId) {
    const db = await connectToDatabase();
    const party = await db.collection("party").findOne({ _id: new ObjectId(partyId) });
    return party;
}

async function getPartiesByGuestId(guestId) {
    const db = await connectToDatabase();
    const parties = await db.collection("party").find({ guests: guestId }).toArray();
    return parties;
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

app.http('delete-from-playlist', {
    methods: ['POST'],
    route: 'party/delete-from-playlist',
    handler: async (request, context) => {
        const { partyId, songId } = JSON.parse(await request.text());
        if (!partyId || !songId) {
            return { status: 400, body: JSON.stringify({ message: "Party ID and Song ID are required" }) };
        }
        try {
            await deleteFromPlaylistBySongId(partyId, songId);
            return { status: 200, body: JSON.stringify({ message: "Song removed from playlist successfully" }) };
        } catch (error) {
            console.error("Error removing song from playlist:", error);
            return { status: 500, body: JSON.stringify({ message: "Internal Server Error", error: error.message }) };
        }
    }
});


app.http('get-all-songs', {
    methods: ['GET'],
    route: 'party/get-all-songs/{partyId}',
    handler: async (request, context) => {
        const partyId = request.params.partyId;
        if (!partyId) {
            return { status: 400, body: JSON.stringify({ message: "Party ID is required" }) };
        }
        try {
            const db = await connectToDatabase();
            const party = await db.collection("party").findOne({ _id: new ObjectId(partyId) }, { projection: { playlist: 1 } });
            const songs = party ? party.playlist : [];
            return { status: 200, body: JSON.stringify(songs) };
        } catch (error) {
            console.error("Error fetching songs from playlist:", error);
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

app.http('get-party-by-id', {
    methods: ['GET'],
    route: 'party/get-party-by-id',
    handler: async (request, context) => {
        const partyId = request.query.get('partyId');
        if (!partyId) {
            return { status: 400, body: JSON.stringify({ message: "Party ID is required" }) };
        }
        try {
            const party = await getPartyById(partyId);
            return { status: 200, body: JSON.stringify(party) };
        } catch (error) {
            console.error("Error fetching party by ID:", error);
            return { status: 500, body: JSON.stringify({ message: "Internal Server Error", error: error.message }) };
        }
    }
});

app.http('get-parties-by-guest-id', {
    methods: ['GET'],
    route: 'party/get-parties-by-guest-id',
    handler: async (request, context) => {
        const guestId = request.query.get('guestId');
        if (!guestId) {
            return { status: 400, body: JSON.stringify({ message: "Guest ID is required" }) };
        }
        try {
            const parties = await getPartiesByGuestId(guestId);
            return { status: 200, body: JSON.stringify(parties) };
        } catch (error) {
            console.error("Error fetching parties by guest ID:", error);
            return { status: 500, body: JSON.stringify({ message: "Internal Server Error", error: error.message }) };
        }
    }
});

app.http('songs-getOne', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'songs/getById/{songId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const songId = request.params.songId;
            if (!/^[0-9a-fA-F]{24}$/.test(songId)) {
                return { status: 400, body: "Invalid song ID format" };
            }
            const song = await db.collection("songs").findOne({ "_id": new ObjectId(songId)});
            if (!song) {
                return { status: 404, body: "Song not found" };
            }
            return { body: JSON.stringify(song) };
        } catch (error) {
            console.error("Error fetching song:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});


app.http('songs-getOne-aferUser', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'songs/getOne/{songId}/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const songId = request.params.songId;
            if (!/^[0-9a-fA-F]{24}$/.test(songId)) {
                return { status: 400, body: "Invalid song ID format" };
            }
            const song = await db.collection("songs").findOne({ "_id": new ObjectId(songId), 'userId': userId});
            if (!song) {
                return { status: 404, body: "Song not found" };
            }
            return { body: JSON.stringify(song) };
        } catch (error) {
            console.error("Error fetching song:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});

async function getPartiesByAdminId(adminId) {
    const db = await connectToDatabase();
    const parties = await db.collection("party").find({ admin: adminId }).toArray();
    return parties;
}


app.http('get-parties-by-admin-id', {
    methods: ['GET'],
    route: 'party/get-parties-by-admin-id',
    handler: async (request, context) => {
        const adminId = request.query.get('adminId');
        if (!adminId) {
            return { status: 400, body: JSON.stringify({ message: "Admin ID is required" }) };
        }
        try {
            const parties = await getPartiesByAdminId(adminId);
            return { status: 200, body: JSON.stringify(parties) };
        } catch (error) {
            console.error("Error fetching parties by admin ID:", error);
            return { status: 500, body: JSON.stringify({ message: "Internal Server Error", error: error.message }) };
        }
    }
});