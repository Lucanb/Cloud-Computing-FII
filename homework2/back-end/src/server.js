import express from "express";
import cors from "cors";
import { decodeToken } from "./middleware/index.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(decodeToken); // Utilizați funcția de middleware importată

app.get('/login', (req, res) => {
    console.log(req.headers.authorization);
    return res.json({
        todos: [
            {
                title: "task1",
            },
            {
                title: "task2",
            },
            {
                title: "task3",
            }
        ]
    });
});

const server = app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});

export default server;
