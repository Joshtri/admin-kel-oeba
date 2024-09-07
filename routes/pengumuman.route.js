import express from "express";
import { addPengumuman, createPengumuman, deletePengumuman, getPengumuman, } from "../controllers/pengumuman.controller.js";
import multer from 'multer';
import { uploadSinglePDF } from "../config/multerConfig.js";
import protect from "../config/auth/protect.js";
const pengumumanRoute = express.Router();

// Set up multer middleware
const upload = multer();

// router.post('/adm/data/pengumuman', upload.single('file'), createPengumuman);


pengumumanRoute.get('/pengumuman',protect,getPengumuman)
pengumumanRoute.get('/add_pengumuman',protect,addPengumuman)
pengumumanRoute.post('/pengumuman', protect,upload.single('file'), createPengumuman);
pengumumanRoute.delete('/pengumuman/:id', protect,deletePengumuman);


export default pengumumanRoute;