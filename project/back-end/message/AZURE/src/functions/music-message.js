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

app.http('messages-save', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'message/save/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const { id_reciever, link_melodie } = JSON.parse(await request.text());
            const messageData = { userId, id_reciever, link_melodie, createdAt: new Date() }; // Adăugarea câmpului createdAt
            console.log(messageData);
            const newMessage = await db.collection("messages").insertOne(messageData);
            return { status: 201, body: JSON.stringify(newMessage) };
        } catch (error) {
            console.error("Error saving message:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});

app.http('messages-getRecent', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'messages/getRecent/{userId}',
    handler: async (request, context) => {
        const db = await connectToDatabase();
        try {
            const userId = request.params.userId;
            const oneDayAgo = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
            const messages = await db.collection("messages").find({
                'id_reciever': userId,
                'createdAt': { $gte: oneDayAgo }
            }).toArray();
            return { body: JSON.stringify(messages) };
        } catch (error) {
            console.error("Error fetching recent messages:", error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});