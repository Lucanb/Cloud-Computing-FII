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

//Artists:
app.http('artists-post', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'artists/save/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const artistData =  JSON.parse(await request.text());
            artistData.userId = userId;
            console.log(artistData);
            const newArtist = await db.collection("artists").insertOne(artistData);
            return { status: 201, body: JSON.stringify(newArtist) };
        } catch (error) {
            console.error("Error saving artist:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});

app.http('artists-getAll', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'artists/getAll/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const artistsCollection = db.collection("artists");
            const userId = request.params.userId;
            const artists = await artistsCollection.find({'userId': userId}).toArray();
            return { body: JSON.stringify(artists) };
        } catch (error) {
            console.error("Error fetching artists:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});

app.http('artists-getOne', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'artists/getOne/{artistId}/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const artistId = request.params.artistId;
            if (!/^[0-9a-fA-F]{24}$/.test(artistId)) {
                return { status: 400, body: "Invalid artist ID format" };
            }
            const artist = await db.collection("artists").findOne({ "_id": new ObjectId(artistId), 'userId': userId});
            if (!artist) {
                return { status: 404, body: "Artist not found" };
            }
            return { body: JSON.stringify(artist) };
        } catch (error) {
            console.error("Error fetching artist:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});

app.http('artists-deleteOne', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'artists/deleteOne/{artistId}/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const artistId = request.params.artistId;
            if (!/^[0-9a-fA-F]{24}$/.test(artistId)) {
                return { status: 400, body: "Invalid artist ID format" };
            }
            const artist = await db.collection("artists").findOneAndDelete({ "_id": new ObjectId(artistId), 'userId': userId});
            if (!artist) {
                return { status: 404, body: "Artist not found" };
            }
            return { body: JSON.stringify(artist) };
        } catch (error) {
            console.error("Error fetching artist:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});

app.http('artists-deleteAll', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'artists/deleteAll/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const result = await db.collection("artists").deleteMany({'userId': userId});
            return { body: JSON.stringify(result) };
        } catch (error) {
            console.error("Error deleting all artists:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});

app.http('artists-updateAll', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'artists/updateAll/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const updateData = JSON.parse(await request.text());
            const result = await db.collection("artists").updateMany({'userId': userId}, { $set: updateData});
            return { body: JSON.stringify(result) };
        } catch (error) {
            console.error("Error updating all artists:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});

app.http('artists-updateOne', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'artists/updateOne/{artistId}/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const artistId = request.params.artistId;
            if (!/^[0-9a-fA-F]{24}$/.test(artistId)) {
                return { status: 400, body: "Invalid artist ID format" };
            }
            const updateData = JSON.parse(await request.text());
            const result = await db.collection("artists").updateOne({ "_id": new ObjectId(artistId), 'userId': userId }, { $set: updateData });
            if (result.modifiedCount === 0) {
                return { status: 404, body: "Artist not found" };
            }
            return { body: JSON.stringify(result) };
        } catch (error) {
            console.error("Error updating artist:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});
// Songs:
app.http('songs-post', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'songs/save/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const songData =  JSON.parse(await request.text());
            songData.userId = userId;
            console.log(songData);
            const newSong = await db.collection("songs").insertOne(songData);
            return { status: 201, body: JSON.stringify(newSong) };
        } catch (error) {
            console.error("Error saving song:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});

app.http('songs-getAll', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'songs/getAll/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const songsCollection = db.collection("songs");
            const songs = await songsCollection.find({'userId': userId}).toArray();
            return { body: JSON.stringify(songs) };
        } catch (error) {
            console.error("Error fetching songs:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});

app.http('songs-getOne', {
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

app.http('songs-getSongsByAlbum', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'songs/getSongsByAlbum/{albumTitle}/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const albumTitle = request.params.albumTitle;
            const songs = await db.collection("songs").find({ 'album': albumTitle, 'userId': userId }).toArray();
            if (!songs || songs.length === 0) {
                return { status: 404, body: "Songs not found for this album" };
            }
            return { body: JSON.stringify(songs) };
        } catch (error) {
            console.error("Error fetching songs:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});


app.http('songs-deleteOne', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'songs/deleteOne/{songId}/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const songId = request.params.songId;
            if (!/^[0-9a-fA-F]{24}$/.test(songId)) {
                return { status: 400, body: "Invalid song ID format" };
            }
            const song = await db.collection("songs").findOneAndDelete({ "_id": new ObjectId(songId), 'userId': userId});
            if (!song) {
                return { status: 404, body: "Song not found" };
            }
            return { body: JSON.stringify(song) };
        } catch (error) {
            console.error("Error deleting song:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});

app.http('songs-deleteAll', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'songs/deleteAll/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const result = await db.collection("songs").deleteMany({'userId': userId});
            return { body: JSON.stringify(result) };
        } catch (error) {
            console.error("Error deleting all songs:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});

app.http('songs-updateAll', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'songs/updateAll/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const updateData = JSON.parse(await request.text());
            const result = await db.collection("songs").updateMany({'userId': userId}, { $set: updateData});
            return { body: JSON.stringify(result) };
        } catch (error) {
            console.error("Error updating all songs:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});

app.http('songs-updateOne', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'songs/updateOne/{songId}/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const songId = request.params.songId;
            if (!/^[0-9a-fA-F]{24}$/.test(songId)) {
                return { status: 400, body: "Invalid song ID format" };
            }
            const updateData = JSON.parse(await request.text());
            const result = await db.collection("songs").updateOne({ "_id": new ObjectId(songId), 'userId': userId }, { $set: updateData });
            if (result.modifiedCount === 0) {
                return { status: 404, body: "Song not found" };
            }
            return { body: JSON.stringify(result) };
        } catch (error) {
            console.error("Error updating song:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});

// Albums:
app.http('albums-post', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'albums/save/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const albumData =  JSON.parse(await request.text());
            albumData.userId = userId;
            console.log(albumData);
            const newAlbum = await db.collection("albums").insertOne(albumData);
            return { status: 201, body: JSON.stringify(newAlbum) };
        } catch (error) {
            console.error("Error saving album:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});

app.http('albums-getAll', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'albums/getAll/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const albumsCollection = db.collection("albums");
            const albums = await albumsCollection.find({'userId': userId}).toArray();
            return { body: JSON.stringify(albums) };
        } catch (error) {
            console.error("Error fetching albums:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});

app.http('albums-getOne', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'albums/getOne/{albumId}/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const albumId = request.params.albumId;
            if (!/^[0-9a-fA-F]{24}$/.test(albumId)) {
                return { status: 400, body: "Invalid album ID format" };
            }
            const album = await db.collection("albums").findOne({ "_id": new ObjectId(albumId), 'userId': userId});
            if (!album) {
                return { status: 404, body: "Album not found" };
            }
            return { body: JSON.stringify(album) };
        } catch (error) {
            console.error("Error fetching album:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});

app.http('albums-getAlbumByArtist', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'albums/getAlbumsByArtist/{artistName}/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const artistName = request.params.artistName;
            const albums = await db.collection("albums").find({ 'artist': artistName, 'userId': userId}).toArray();
            if (!albums || albums.length === 0) {
                return { status: 404, body: "Albums not found for this artist" };
            }
            return { body: JSON.stringify(albums) };
        } catch (error) {
            console.error("Error fetching albums:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});


app.http('albums-deleteOne', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'albums/deleteOne/{albumId}/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const albumId = request.params.albumId;
            if (!/^[0-9a-fA-F]{24}$/.test(albumId)) {
                return { status: 400, body: "Invalid album ID format" };
            }
            const album = await db.collection("albums").findOneAndDelete({ "_id": new ObjectId(albumId), 'userId': userId});
            if (!album) {
                return { status: 404, body: "Album not found" };
            }
            return { body: JSON.stringify(album) };
        } catch (error) {
            console.error("Error deleting album:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});

app.http('albums-deleteAll', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'albums/deleteAll/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const result = await db.collection("albums").deleteMany({'userId': userId});
            return { body: JSON.stringify(result) };
        } catch (error) {
            console.error("Error deleting all albums:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});

app.http('albums-updateAll', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'albums/updateAll/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const updateData = JSON.parse(await request.text());
            const result = await db.collection("albums").updateMany({'userId': userId}, { $set: updateData});
            return { body: JSON.stringify(result) };
        } catch (error) {
            console.error("Error updating all albums:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});

app.http('albums-updateOne', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'albums/updateOne/{albumId}/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const albumId = request.params.albumId;
            if (!/^[0-9a-fA-F]{24}$/.test(albumId)) {
                return { status: 400, body: "Invalid album ID format" };
            }
            const updateData = JSON.parse(await request.text());
            const result = await db.collection("albums").updateOne({ "_id": new ObjectId(albumId), 'userId': userId }, { $set: updateData });
            if (result.modifiedCount === 0) {
                return { status: 404, body: "Album not found" };
            }
            return { body: JSON.stringify(result) };
        } catch (error) {
            console.error("Error updating album:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});
