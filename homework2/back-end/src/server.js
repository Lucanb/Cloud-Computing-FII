import express from "express";
import cors from "cors";
import { decodeToken } from "./middleware/index.js";
import { connectDB } from './config/mongoDB.js';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post('/login', decodeToken, (req, res) => {

    console.log("Token decoded:", req.value);

    // În acest exemplu, vom trimite înapoi către client detaliile token-ului decodat și un mesaj de confirmare
    res.status(200).json({
        message: 'Token decoded successfully',
        tokenData: req.value
    });
});

connectDB()
    .then(() => {

        const port = process.env.PORT || 3001;
        app.listen(port, () => {
            console.log(`Serverul a pornit și ascultă pe portul ${port}`);
        });
    })
    .catch((error) => {
        console.error('Eroare de conectare la baza de date:', error);
    });

const server = app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});