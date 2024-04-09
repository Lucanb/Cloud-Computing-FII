import express from "express";
import cors from "cors";
import { decodeToken } from "../middleware/index.js";
const router = express.Router();
router.post('/login', decodeToken, (req, res) => {

    console.log("Token decoded:", req.value);

    res.status(200).json({
        message: 'Token decoded successfully',
        tokenData: req.value
    });
});

export default router;