import express from "express";
import cors from "cors";
import { decodeToken } from "./middleware/index.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// app.get('/login', (req, res) => {
//     console.log(req.headers.authorization);
//     res.setHeader('Content-Type', 'application/json');
//     return res.json({
//         todos: [
//             {
//                 title: "task1",
//             },
//             {
//                 title: "task2",
//             },
//             {
//                 title: "task3",
//             }
//         ]
//     });
// });

app.post('/login', decodeToken, (req, res) => {

    console.log("Token decoded:", req.value);

    // În acest exemplu, vom trimite înapoi către client detaliile token-ului decodat și un mesaj de confirmare
    res.status(200).json({
        message: 'Token decoded successfully',
        tokenData: req.value
    });
});

const server = app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
