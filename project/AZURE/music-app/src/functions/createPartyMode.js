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

async function createParty(admin) {
    const db = await connectToDatabase();
    try {
        const newParty = { admin };
        const result = await db.collection("party").insertOne(newParty);
        return { id: result.insertedId, admin };
    } catch (error) {
        console.error("Error creating party:", error);
        throw error;
    }
}

app.http('create-party', {
    methods: ['POST'],
    route: 'party/create',
    handler: async (request, context) => {
        const { admin } = JSON.parse(await request.text());
        if (!admin) {
            return { status: 400, body: { message: "Admin is required" } };
        }
        try {
            const newParty = await createParty(admin);
            return { status: 201, body: JSON.stringify(newParty) };
        } catch (error) {
            console.error("Error creating party:", error);
            return { status: 500, body: { message: "Internal Server Error", error: error.message } };
        }
    }
});

async function addUserToParty(username, id_party, role, accepted) {
    const db = await connectToDatabase();
    try {
        const newUser = { username, id_party: new ObjectId(id_party), role, accepted };
        const result = await db.collection("invites").insertOne(newUser);
        return { id: result.insertedId, username, id_party, role, accepted };
    } catch (error) {
        console.error("Error adding user to party:", error);
        throw error;
    }
}

app.http('add-user-to-party', {
    methods: ['POST'],
    route: 'party/add-user',
    handler: async (request, context) => {
        const { username, id_party, role, accepted } = JSON.parse(await request.text());
        if (!username || !id_party || role === undefined || accepted === undefined) {
            return { status: 400, body: JSON.stringify({ message: "All fields are required" }) };
        }
        try {
            const newUser = await addUserToParty(username, id_party, role, accepted);
            return { status: 201, body: JSON.stringify(newUser) };
        } catch (error) {
            console.error("Error adding user to party:", error);
            return { status: 500, body: JSON.stringify({ message: "Internal Server Error", error: error.message }) };
        }
    }
});

async function getPartyByAdmin(admin) {
    const db = await connectToDatabase();
    try {
        const party = await db.collection("party").findOne({ admin });
        return party;
    } catch (error) {
        console.error("Error getting party:", error);
        throw error;
    }
}

app.http('get-party', {
    methods: ['GET'],
    route: 'party/by-admin/{admin}',
    handler: async (request, context) => {
        const admin = request.params.admin;
        try {
            const party = await getPartyByAdmin(admin);
            if (!party) {
                return { status: 404, body: { message: "Party not found" } };
            }
            return { status: 200, body: JSON.stringify(party) };
        } catch (error) {
            console.error("Error getting party:", error);
            return { status: 500, body: { message: "Internal Server Error", error: error.message } };
        }
    }
});

// Delete Party by Admin ID
async function deletePartyByAdmin(admin) {
    const db = await connectToDatabase();
    try {
        const result = await db.collection("party").deleteOne({ admin });
        return result.deletedCount > 0;
    } catch (error) {
        console.error("Error deleting party:", error);
        throw error;
    }
}

app.http('delete-party', {
    methods: ['DELETE'],
    route: 'party/by-admin/{admin}',
    handler: async (request, context) => {
        const admin = request.params.admin;
        try {
            const success = await deletePartyByAdmin(admin);
            if (!success) {
                return { status: 404, body: { message: "Party not found" } };
            }
            return { status: 204 };
        } catch (error) {
            console.error("Error deleting party:", error);
            return { status: 500, body: { message: "Internal Server Error", error: error.message } };
        }
    }
});

// Get Users by Admin ID
async function getUsersByAdmin(admin) {
    const db = await connectToDatabase();
    try {
        const party = await db.collection("party").findOne({ admin });
        if (!party) {
            throw new Error("Party not found");
        }
        const users = await db.collection("invites").find({ id_party: party._id }).toArray();
        return users;
    } catch (error) {
        console.error("Error getting users for party:", error);
        throw error;
    }
}

app.http('get-users-by-party', {
    methods: ['GET'],
    route: 'party/by-admin/{admin}/users',
    handler: async (request, context) => {
        const admin = request.params.admin;
        try {
            const users = await getUsersByAdmin(admin);
            return { status: 200, body: JSON.stringify(users) };
        } catch (error) {
            console.error("Error getting users for party:", error);
            return { status: 500, body: { message: "Internal Server Error", error: error.message } };
        }
    }
});

// Delete User from Party by Admin ID
async function deleteUserFromPartyByAdmin(admin, username) {
    const db = await connectToDatabase();
    try {
        const party = await db.collection("party").findOne({ admin });
        if (!party) {
            throw new Error("Party not found");
        }
        const result = await db.collection("invites").deleteOne({ username, id_party: party._id });
        return result.deletedCount > 0;
    } catch (error) {
        console.error("Error deleting user from party:", error);
        throw error;
    }
}

app.http('delete-user-from-party', {
    methods: ['DELETE'],
    route: 'party/by-admin/{admin}/user/{username}',
    handler: async (request, context) => {
        const { admin, username } = request.params;
        try {
            const success = await deleteUserFromPartyByAdmin(admin, username);
            if (!success) {
                return { status: 404, body: { message: "User not found in party" } };
            }
            return { status: 204 };
        } catch (error) {
            console.error("Error deleting user from party:", error);
            return { status: 500, body: { message: "Internal Server Error", error: error.message } };
        }
    }
});