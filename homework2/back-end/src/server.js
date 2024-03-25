import express from "express";
import cors from "cors";
import { decodeToken } from "./middleware/index.js";
import { connectDB } from './config/mongoDB.js';
import albumsRoutes from "./routes/albums.js";
import songsRoutes from "./routes/songs.js";
import artistsRoutes from "./routes/artist.js";

const app = express();
const port = 5000;

app.use(cors({origin : true}));
app.use(express.json());

app.post('/login', decodeToken, (req, res) => {

    console.log("Token decoded:", req.value);

    // În acest exemplu, vom trimite înapoi către client detaliile token-ului decodat și un mesaj de confirmare
    res.status(200).json({
        message: 'Token decoded successfully',
        tokenData: req.value
    });
});

app.get("/",(req,res)=>{
    return res.json("hai there...");
})

// const artistsRoutes = require('./routes/artist.js')
// app.use("api/artist/", artistsRoutes);

app.use("api/albums", albumsRoutes);
app.use("api/artists", artistsRoutes);
app.use("api/songs", songsRoutes);

// connectDB()
//     .then(() => {
//
//         const port = process.env.PORT || 3001;
//         app.listen(port, () => {
//             console.log(`Serverul a pornit și ascultă pe portul ${port}`);
//         });
//     })
//     .catch((error) => {
//         console.error('Eroare de conectare la baza de date:', error);
//     });
//
const server = app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});