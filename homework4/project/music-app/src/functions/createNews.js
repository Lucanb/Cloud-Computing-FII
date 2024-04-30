const { Pool } = require('pg');
const { app } = require('@azure/functions');

const pool = new Pool({
    connectionString: "postgres://luca%40music-luca:'UFDHGEQS0727156236321%23a'@music-luca.postgres.database.azure.com:5432/music",
    ssl: {
        rejectUnauthorized: false
    }
});

async function connectToDatabase() {
    try {
        const client = await pool.connect();
        console.log("Connected to PostgreSQL database");
        return client;
    } catch (err) {
        console.error("Error connecting to PostgreSQL database:", err);
        throw err;
    }
}

app.http('news-post', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'news/create',
    handler: async (context, req) => {
        console.log(req.body)
        const { topicName, title, content } = req.body;

        try {
            const client = await connectToDatabase();

            const result = await client.query(
                'INSERT INTO news (topic_name, title, content) VALUES ($1, $2, $3) RETURNING id',
                [topicName, title, content]
            );

            context.res = {
                status: 201,
                body: { id: result.rows[0].id, message: "News created successfully" }
            };

            client.release();
        } catch (error) {
            console.error("Error creating news:", error);
            context.res = {
                status: 500,
                body: { message: "Internal Server Error", error: error.message }
            };
        }
    }
});
