import express from "express";

const router = express.Router();

router.get("/getAll",async (req,res)=>{
    return res.json("getting the artists");
})

export default router;