const { app } = require('@azure/functions');
const { BlobServiceClient } = require('@azure/storage-blob');
const { shuffle, findMatchingSongs } = require('./musicAI'); // Importarea funcțiilor
const { MongoClient } = require('mongodb');

const connectionString = 'https://musicappluca.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiyx&se=2024-08-20T00:03:21Z&st=2024-05-19T16:03:21Z&spr=https&sig=TAiN0%2BNPbD1Ie5l5aLSpDgXwEdGKYSrmUY50H%2BTEBPg%3D';
const containerName = 'remixed-audios';

const blobServiceClient = new BlobServiceClient(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

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

app.http('generate-music', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'generate',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        const { playlist } = JSON.parse(await request.text());
        console.log('Received playlist:', playlist);

        // Extragem numele melodiilor și numele artiștilor din playlist pentru a le folosi ca searchWords
        const searchWords = playlist.map(item => item.title);
        const searchArtists = playlist.map(item => item.artist);

        try {
            // Obținem remixuri din baza de date
            const remixes = await db.collection("remixes").find({ songName: { $in: searchWords } }).toArray();
            console.log('Remixes found:', remixes);

            const remixLinks = remixes.map(remix => remix.link);

            // Formăm un playlist cu link-uri, nume și artiști
            const remixPlaylist = remixes.map(remix => [remix.link, remix.songName, remix.artistName]);

            return new Promise((resolve, reject) => {
                findMatchingSongs(remixPlaylist, searchWords, searchArtists, async (matches) => {
                    if (matches && matches.length > 0) {
                        const selectedMixes = [];

                        for (const match of matches) {
                            const blobName = decodeURIComponent(match.link.split('/').pop().split('?')[0]);
                            selectedMixes.push(`https://musicappluca.blob.core.windows.net/remix/${blobName}`);
                        }

                        console.log('Selected mixes:', selectedMixes);

                        resolve({
                            status: 200,
                            body: JSON.stringify({ urls: selectedMixes })
                        });
                    } else {
                        const allRemixes = await db.collection("remixes").find({}).toArray();
                        const allRemixLinks = allRemixes.map(remix => remix.link);
                        const allRemixPlaylist = allRemixes.map(remix => [remix.link, remix.songName, remix.artistName]);

                        findMatchingSongs(allRemixPlaylist, searchWords, searchArtists, async (backupMatches) => {
                            if (backupMatches && backupMatches.length > 0) {
                                const selectedBackupMixes = [];

                                for (const match of backupMatches) {
                                    const blobName = decodeURIComponent(match.link.split('/').pop().split('?')[0]);
                                    selectedBackupMixes.push(`https://musicappluca.blob.core.windows.net/remix/${blobName}`);
                                }

                                console.log('Selected backup mixes:', selectedBackupMixes);

                                resolve({
                                    status: 200,
                                    body: JSON.stringify({ urls: selectedBackupMixes })
                                });
                            } else {
                                resolve({
                                    status: 200,
                                    body: JSON.stringify({ message: 'No matching songs found.' })
                                });
                            }
                        });
                    }
                });
            });
        } catch (error) {
            console.error("Error querying database or processing request:", error);
            return {
                status: 500,
                body: "Internal Server Error"
            };
        }
    }
});
