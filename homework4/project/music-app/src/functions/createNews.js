const { Pool } = require('pg');
const { app } = require('@azure/functions');

const encodedUsername = encodeURIComponent("luca@music-luca");
const encodedPassword = encodeURIComponent("UFDHGEQS0727156236321#a");
const connectionString = `postgres://${encodedUsername}:${encodedPassword}@music-luca.postgres.database.azure.com:5432/music`;

const pool = new Pool({
    
    connectionString: connectionString,
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
    handler: async (request,context) => {
        console.log(request.body)
        const { topicName, title, content } = JSON.parse(await request.text());
        console.log('topic : ',topicName)
        console.log('title : ',title)
        console.log('content : ',content)

        try {
            const client = await connectToDatabase();

            // Verifică dacă există deja un topic cu același nume
            const topicExistsQuery = 'SELECT EXISTS (SELECT 1 FROM topics WHERE name = $1)';
            const topicExistsResult = await client.query(topicExistsQuery, [topicName]);
            const topicExists = topicExistsResult.rows[0].exists;

            // Verifică dacă există deja un titlu cu același nume
            const titleExistsQuery = 'SELECT EXISTS (SELECT 1 FROM news WHERE title = $1)';
            const titleExistsResult = await client.query(titleExistsQuery, [title]);
            const titleExists = titleExistsResult.rows[0].exists;

            // Verifică dacă atât topicul, cât și titlul sunt diferite de orice înregistrare existentă
            if (topicExists || titleExists) {
                context.res = {
                    status: 400,
                    body: { message: "Topicul sau titlul există deja în baza de date" }
                };
                return;
            }

            // Dacă nu există deja un topic sau titlu cu același nume, se face inserția
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
