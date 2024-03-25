import express from "express";

const router = express.Router();

router.get("/getAll",async (req,res)=>{
    return res.json("getting the songs");
})

export default router;