const { app } = require('@azure/functions');
const { BlobServiceClient } = require('@azure/storage-blob');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const connectionString = 'https://musicappluca.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiyx&se=2024-08-20T00:03:21Z&st=2024-05-19T16:03:21Z&spr=https&sig=TAiN0%2BNPbD1Ie5l5aLSpDgXwEdGKYSrmUY50H%2BTEBPg%3D';
const containerName = 'remix';

const blobServiceClient = new BlobServiceClient(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

async function createContainerIfNotExists() {
    try {
        const exists = await containerClient.exists();
        if (!exists) {
            await containerClient.create();
            console.log(`Container ${containerName} created`);
        } else {
            console.log(`Container ${containerName} already exists`);
        }
    } catch (error) {
        console.error("Error checking or creating container:", error);
        throw error;
    }
}

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

app.http('save-remix', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'saveremix',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        const { filePath, artistName, songName, genre } = JSON.parse(await request.text());

        await createContainerIfNotExists();

        // Upload the file to Azure Blob Storage
        const blobName = path.basename(filePath);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        try {
            const fileData = fs.readFileSync(filePath);
            await blockBlobClient.uploadData(fileData);
            console.log(`File uploaded to Blob Storage: ${blobName}`);

            // Save metadata to Cosmos DB
            const remixData = {
                link: blockBlobClient.url,
                artistName,
                songName,
                genre
            };
            const newRemix = await db.collection("remixes").insertOne(remixData);
            console.log(`Metadata saved to Cosmos DB: ${JSON.stringify(newRemix)}`);

            return {
                status: 201,
                body: JSON.stringify(newRemix)
            };
        } catch (error) {
            console.error("Error uploading file or saving metadata:", error);
            return {
                status: 500,
                body: "Internal Server Error"
            };
        }
    }
});