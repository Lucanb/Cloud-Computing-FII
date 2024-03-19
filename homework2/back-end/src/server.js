// server.mjs
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const port = 5000;

app.use(cors());

app.get('/login', (req, res) => {
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
