import express from "express";
import cors from "cors";
import { decodeToken } from "./middleware/index.js";
import { connectDB } from './config/mongoDB.js';
import  auth from './routes/auth.js'
import albumsRoutes from "./routes/albums.js";
import songsRoutes from "./routes/songs.js";
import artistsRoutes from "./routes/artist.js";

const app = express();
const port = 5000;

app.use(cors({origin : true}));
app.use(express.json());

app.use("/api/auth",auth);
app.use("/api/albums", albumsRoutes); // Fix the route prefix here
app.use("/api/artists", artistsRoutes);
app.use("/api/songs", songsRoutes);

connectDB()
    .then(() => {
        const server = app.listen(port, () => {
            console.log(`Server is running at port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Eroare de conectare la baza de date:', error);
    });