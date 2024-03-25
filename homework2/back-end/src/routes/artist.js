import express from "express";
import artist from "../model/artist.js";

const router = express.Router();

router.get("/getAll",async (req,res)=>{
    return res.json("getting the artists");
})

router.post("/save",async (req,res)=>{
    const newArtist = artist({
        name: req.body.name ,
        description: req.body.description,
        members: req.body.members,
        link: req.body.link
    })

    try{
        const savedArtist = await newArtist.save();
        return res.status(200).send({success : true, artist : savedArtist});
    }catch (error){
        //console.log(error);
        return res.status(400).send({succes : false, msg:error});
    }
})

export default router;