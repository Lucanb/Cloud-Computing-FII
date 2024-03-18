const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());

app.get('/api/todos',(req,res)=>{
    return res.json({
        todos: [
            {
                title : "task1",
            },
            {
                title : "task2",
            },
            {
                title : "task3",
            }
        ]});
});

app.listen(port, ()=>{
    console.log(`Server is running at port ${port}`);
})
