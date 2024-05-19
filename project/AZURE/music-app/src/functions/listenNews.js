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

async function getLatestNews() {
    let client;
    try {
        client = await pool.connect();
        console.log("Connected to PostgreSQL database");

        const result = await client.query(
            'SELECT * FROM news ORDER BY id DESC LIMIT 5'
        );

        return result.rows.map(row => ({
            topic_name: row.topic_name,
            title: row.title,
            content: row.content
        }));
    } catch (error) {
        console.error("Error fetching news:", error);
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
}

app.http('get-latest-news', {
    methods: ['GET'],
    route: 'news/latest',
    handler: async (request, context) => {
        try {
            const latestNews = await getLatestNews();
            // context.res = {
            //     status: 200,
            //     body: JSON.stringify(latestNews)
            // };
            console.log(latestNews)
            return {status: 200, body: JSON.stringify(latestNews) };
        } catch (error) {
            console.error("Error getting latest news:", error);
            context.res = {
                status: 500,
                body: { message: "Internal Server Error", error: error.message }
            };
        }
    }
});
