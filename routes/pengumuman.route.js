import express from "express";
import { addPengumuman, createPengumuman, deletePengumuman, getPengumuman, } from "../controllers/pengumuman.controller.js";
import multer from 'multer';
import { uploadSinglePDF } from "../config/multerConfig.js";
const pengumumanRoute = express.Router();

// Set up multer middleware
const upload = multer();

// router.post('/adm/data/pengumuman', upload.single('file'), createPengumuman);


pengumumanRoute.get('/pengumuman',getPengumuman)
pengumumanRoute.get('/add_pengumuman',addPengumuman)
pengumumanRoute.post('/pengumuman', upload.single('file'), createPengumuman);
pengumumanRoute.delete('/pengumuman/:id', deletePengumuman);


export default pengumumanRoute;