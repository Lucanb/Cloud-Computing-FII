const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Cloud_h1',
    password: 'UFDHGEQS0727156236321',
    port: 5432,
});

const config = {};

config.PORT = 8080;
config.HOSTNAME = '127.0.1';


module.exports = {config,pool};