import express from "express";
import { addPengumuman, createPengumuman, deletePengumuman, editPengumumanPage, getPengumuman, updatePengumuman, } from "../controllers/pengumuman.controller.js";
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
// Route to render the edit page
pengumumanRoute.get('/pengumuman/edit/:id', editPengumumanPage);

// Route to handle the form submission for updating
pengumumanRoute.post('/pengumuman/:id', upload.single('berkas_pengumuman_pdf'), updatePengumuman);

export default pengumumanRoute;