import express from "express";
import artist from "../model/artist.js";
import Artist from "../model/artist.js";
import song from "../model/song.js";

const router = express.Router();


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

router.get("/getAll", async (req, res) => {
    try {
        const allArtists = await Artist.find();
        return res.json(allArtists);
    } catch (error) {
        return res.status(500).json({ success: false, msg: "A apărut o eroare la obținerea tuturor artiștilor." });
    }
});

router.get("/getOne/:id", async (req, res) => {
    const filter = { _id: req.params.id };

    try {
        const artist = await Artist.findOne(filter);

        if (artist) {
            return res.status(200).send({succes : true,artist : artist});
        } else {
            return res.status(400).json({ success: false ,message: "Artistul nu a fost găsit." });
        }
    } catch (error) {
        return res.status(400).json({ success: false, msg: error.message });
    }
});

router.delete("/deleteAll", async (req, res) => {
    try {
        const deletedArtists = await Artist.deleteMany({});
        if (!deletedArtists) {
            return res.status(404).json({ success: false, message: "Nu s-au găsit obiecte de șters." });
        }
        return res.status(200).json({ success: true, message: "Toate obiectele au fost șterse cu succes." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Eroare la ștergerea obiectelor." });
    }
});
router.delete("/deleteOne/:id", async (req, res) => {
    const artistId = req.params.id;

    try {
        const deletedArtist = await Artist.findByIdAndDelete(artistId);
        if (!deletedArtist) {
            return res.status(404).json({ success: false, message: "Artistul nu a fost găsit." });
        }
        return res.status(200).json({ success: true, message: "Artistul a fost șters cu succes." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Eroare la ștergerea artistului." });
    }
});

router.put("/updateAll", async (req, res) => {
    const updatedData = req.body;

    try {
        const updatedArtists = await Artist.updateMany({}, updatedData);
        if (!updatedArtists) {
            return res.status(404).json({ success: false, message: "Nu s-au găsit obiecte de actualizat." });
        }
        return res.status(200).json({ success: true, message: "Toate obiectele au fost actualizate cu succes." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Eroare la actualizarea obiectelor." });
    }
});

router.put("/updateOne/:id", async (req, res) => {
    const artistId = req.params.id;
    const updatedData = req.body;

    try {
        const updatedArtist = await Artist.findByIdAndUpdate(artistId, updatedData, { new: true });
        if (!updatedArtist) {
            return res.status(404).json({ success: false, message: "Artistul nu a fost găsit." });
        }
        return res.status(200).json({ success: true, artist: updatedArtist });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Eroare la actualizarea artistului." });
    }
});

export default router;