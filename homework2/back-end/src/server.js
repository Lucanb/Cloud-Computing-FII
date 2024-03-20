import express from "express";
import cors from "cors";
import { decodeToken } from "./middleware/index.js";

const app = express();
const port = 5000;

app.use(cors());
// app.use(decodeToken);

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

app.post('/login', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    console.log("Token received:", token);

    // Trimite un răspuns către client pentru a confirma recepționarea token-ului
    res.status(200).json({ message: 'Token received', token });
});

const server = app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
