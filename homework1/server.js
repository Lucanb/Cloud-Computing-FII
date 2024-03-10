const http = require('http')
const fs = require('fs')
const {config,pool} = require('./config')
const {Routes,RouterController} = require('./router')
const path = require('path')
const PassWord = require('./password')

const controller = new RouterController([
    new Routes("GET","/users",async (req,res)=>{
        try {
            const query = `SELECT * FROM users`;
            const result = await pool.query(query)

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.rows));
        }catch(error){
            console.error("Error fetching users", error);
            res.writeHead(500);
            res.end("Internal Error");
        }
    }),

    new Routes("GET","/user/:id",async (req,res)=>{
        try {
            const userId = req.url.split('/').pop();
            console.log(userId)
            const values=[userId]
            const query = `SELECT * FROM users WHERE id = $1`;
            const result = await pool.query(query,values)

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.rows));
        }catch(error){
            console.error("Error fetching users", error);
            res.writeHead(500);
            res.end("Internal Error");
        }
    }),

    new Routes("POST","/user/:id",async (req,res)=>{ ///trebuie catalogat drept nasol ca e post cu id
        let body = ''
        try{

            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            const userId = req.url.split('/').pop();
            req.on('end', async () => {
                if (userId) {
                    res.writeHead(404, {'Content-Type': 'application/json'});
                    return res.end(JSON.stringify({error: 'Route Not Found'}));
                }
            });

        } catch (error){
            console.error("Error at creating resource", error);
            res.writeHead(500);
            res.end("Internal Error");
        }
    }),

    new Routes("POST", "/users", async (req, res) => {
        let body = '';
        try {
            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                const requestData = JSON.parse(body);

                if (!Array.isArray(requestData) || requestData.length === 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Parametrii incompleti în corpul cererii' }));
                }

                for (const utilizator of requestData) {
                    const { nume, age, password, message } = utilizator;

                    if (!nume || !age || !password || !message) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Parametrii incompleti în corpul cererii' }));
                    }

                    console.log(nume, age, password, message)
                    const passwordHash = await PassWord.crypt(password);
                    const values = [nume, age, passwordHash, JSON.stringify(message)];
                    const query = `INSERT INTO users (nume, age, password, message) VALUES ($1, $2, $3, $4)`;

                    try {
                        await pool.query(query, values);
                    } catch (insertError) {
                        console.error("Error inserting user", insertError);
                        res.writeHead(500);
                        return res.end("Internal Error");
                    }
                }

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Utilizatori adaugati cu succes' }));
            });

        } catch (error) {
            console.error("Error inserting user", error);
            res.writeHead(500);
            res.end("Internal Error");
        }
    }),

    new Routes("PUT", "/user/:id", async (req, res) => {
        try {
            const userId = req.url.split('/').pop();
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                try {
                    const requestData = JSON.parse(body);
                    const updateFields = Object.keys(requestData);
                    const values = [];
                    let query = 'UPDATE users SET ';

                    for (let i = 0; i < updateFields.length; i++) {
                        const field = updateFields[i];
                        if (field === 'password') {
                            const passwordHash = await PassWord.crypt(requestData[field]);
                            query += `${field} = $${i + 1}`;
                            values.push(passwordHash);
                        } else {
                            query += `${field} = $${i + 1}`;
                            values.push(requestData[field]);
                        }
                        if (i !== updateFields.length - 1) {
                            query += ', ';
                        }
                    }

                    query += ' WHERE id = $' + (updateFields.length + 1);
                    values.push(userId);

                    await pool.query(query, values);

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Utilizator actualizat cu succes' }));
                } catch (parseError) {
                    console.error("Eroare parsare corp cerere", parseError);
                    res.writeHead(400);
                    res.end("Eroare de parsare a corpului cererii");
                }
            });
        } catch (error) {
            console.error("Eroare actualizare utilizator", error);
            res.writeHead(500);
            res.end("Eroare internă");
        }
    }),

    new Routes("PUT", "/users", async (req, res) => {
        try {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                try {
                    const requestData = JSON.parse(body);
                    const updateFields = Object.keys(requestData);
                    const values = [];
                    let query = 'UPDATE users SET ';
                    for (let i = 0; i < updateFields.length; i++) {
                        const field = updateFields[i];
                        if (field === 'password') {
                            const passwordHash = await PassWord.crypt(requestData[field]);
                            query += `${field} = $${i + 1}`;
                            values.push(passwordHash);
                        } else {
                            query += `${field} = $${i + 1}`;
                            values.push(requestData[field]);
                        }
                        if (i !== updateFields.length - 1) {
                            query += ', ';
                        }
                    }

                    query += ' WHERE id > 0';

                    await pool.query(query, values);

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Utilizatori actualizati cu succes' }));
                } catch (parseError) {
                    console.error("Eroare parsare corp cerere", parseError);
                    res.writeHead(400);
                    res.end("Eroare de parsare a corpului cererii");
                }
            });
        } catch (error) {
            console.error("Eroare actualizare utilizatori", error);
            res.writeHead(500);
            res.end("Eroare internă");
        }
    }),

    new Routes("DELETE", "/users", async (req, res) => {
        try {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                try {
                    const query = `DELETE FROM users WHERE id > 0`; //le sterge pe toate
                    await pool.query(query);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Utilizatori stersi cu succes' }));
                } catch (parseError) {
                    console.error("Eroare parsare corp cerere", parseError);
                    res.writeHead(400);
                    res.end("Eroare de parsare a corpului cererii");
                }
            });
        } catch (error) {
            console.error("Eroare stergere utilizatori", error);
            res.writeHead(500);
            res.end("Eroare internă");
        }
    }),
    new Routes("DELETE", "/user/:id", async (req, res) => {
        try {
            let body = '';
            const userId = req.url.split('/').pop();
            console.log(userId)
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                try {
                    if (!userId) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'ID-ul utilizatorului lipsește din corpul cererii' }));
                    }else {
                        const values = [userId];
                        const query = `DELETE FROM users WHERE id = $1`;
                        await pool.query(query, values);
                        console.log('UserID to delete:', userId);
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({message: 'Utilizator sters cu succes'}));
                    }
                } catch (parseError) {
                    console.error("Eroare parsare corp cerere", parseError);
                    res.writeHead(400);
                    res.end("Eroare de parsare a corpului cererii");
                }
            });
        } catch (error) {
            console.error("Eroare stergere utilizator", error);
            res.writeHead(500);
            res.end("Eroare internă");
        }
    })
])
function setCorsHeaders(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Request-Method", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Max-Age", 3600);
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers");
}
const server = http.createServer(async (req,res)=>{
    if (req.method === 'OPTIONS')
    {
        setCorsHeaders(req,res)
        res.writeHead(204)
        res.end()
    }else{
        setCorsHeaders(req,res)
        try{
            await controller.handleRequest(req,res)
        } catch (error) {
            console.error("Internal Error",error)
            res.writeHead(500)
            res.end("Internal Error")
        }
    }
})

server.listen(config.PORT,()=>{
    console.log(`Server listening on port ${config.PORT}`);
})