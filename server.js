const http = require('http')
const fs = require('fs')
const {config,pool} = require('./config')
const {Routes,RouterController} = require('./router')
const path = require('path')
const {parse} = require("querystring"); //trb sa imi fac eu parser

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


    // new Routes("POST","/user/:id",async (req,res)=>{ ///trebuie catalogat drept nasol ca e post cu id
    //     let body = ''
    //     try{
    //
    //         req.on('data', (chunk) => {
    //             body += chunk.toString();
    //         });
    //         const userId = req.url.split('/').pop();
    //         req.on('end', async () => {
    //             if (userId) {
    //                 res.writeHead(404, {'Content-Type': 'application/json'});
    //                 return res.end(JSON.stringify({error: 'Route Not Found'}));
    //             }
    //
    //         });
    //
    //     } catch (error){
    //         console.error("Error inserting user", error);
    //         res.writeHead(500);
    //         res.end("Internal Error");
    //     }
    // }),
    new Routes("POST","/users",async (req,res)=>{
        let body = ''
        try{
            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                const requestData = parse(body);

                const {nume, age, password, message} = requestData;

                if (!nume || !age || !password || !message) {
                    res.writeHead(400, {'Content-Type': 'application/json'});
                    return res.end(JSON.stringify({error: 'Parametrii incompleți în corpul cererii'}));
                }

                const values = [nume, age, password, JSON.stringify(message)];
                const query = `INSERT INTO users (nume, age, password, message) VALUES ($1, $2, $3, $4)`;
                await pool.query(query, values);

                res.writeHead(201, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'User inserted successfully'}));
            });

        } catch (error){
            console.error("Error inserting user", error);
            res.writeHead(500);
            res.end("Internal Error");
        }
    }),

    new Routes("PUT", "/user/:id", async (req, res) => {
        try {
            const userId = req.url.split('/').pop();
            console.log(userId)
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                try {
                    const requestData = parse(body);
                    const { nume, password} = requestData;

                    if (!nume && !password) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Niciun parametru de actualizare furnizat în corpul cererii' }));
                    }

                    const query = `UPDATE users SET nume = $1, password = $2 WHERE id = $3`;
                    const values = [nume, password, userId];

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
            // const userId = req.url.split('/').pop();
            // console.log(userId)
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                try {
                    const requestData = parse(body);
                    const { nume, password} = requestData;

                    if (!nume && !password) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Niciun parametru de actualizare furnizat în corpul cererii' }));
                    }

                    const query = `UPDATE users SET nume = $1, password = $2 WHERE id >0`;
                    const values = [nume, password];

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

    new Routes("DELETE", "/users", async (req, res) => {
        try {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                try {
                    // const requestData = parse(body);
                    // const { id } = requestData;
                    //
                    // if (!id) {
                    //     res.writeHead(400, { 'Content-Type': 'application/json' });
                    //     return res.end(JSON.stringify({ error: 'ID-ul utilizatorului lipsește din corpul cererii' }));
                    // }
                    //
                    // const query = `DELETE FROM users WHERE id = $1`;
                    // const values = [id];
                    const query = `DELETE FROM users WHERE id > 0`; //le sterge pe toate
                    await pool.query(query, values);
                    // console.log('UserID to delete:', id);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Utilizator șters cu succes' }));
                } catch (parseError) {
                    console.error("Eroare parsare corp cerere", parseError);
                    res.writeHead(400);
                    res.end("Eroare de parsare a corpului cererii");
                }
            });
        } catch (error) {
            console.error("Eroare ștergere utilizator", error);
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
                    // const requestData = parse(body);
                    // const { id } = requestData;
                    //
                    // if (!id) {
                    //     res.writeHead(400, { 'Content-Type': 'application/json' });
                    //     return res.end(JSON.stringify({ error: 'ID-ul utilizatorului lipsește din corpul cererii' }));
                    // }
                    //
                    // const query = `DELETE FROM users WHERE id = $1`;
                    const values = [userId];
                    const query = `DELETE FROM users WHERE id = $1`;
                    await pool.query(query, values);
                    console.log('UserID to delete:', userId);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Utilizator șters cu succes' }));
                } catch (parseError) {
                    console.error("Eroare parsare corp cerere", parseError);
                    res.writeHead(400);
                    res.end("Eroare de parsare a corpului cererii");
                }
            });
        } catch (error) {
            console.error("Eroare ștergere utilizator", error);
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