import express from "express";
const kegiatanRoute = express.Router();
import * as kegiatanController from "../controllers/kegiatan.controller.js";
import protect from "../config/auth/protect.js";
import multer from 'multer';
import { deletePengumuman } from "../controllers/pengumuman.controller.js";


// Setup multer untuk menangani file upload
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }, // Batasan ukuran file 5MB
});


kegiatanRoute.get('/kegiatan', protect, kegiatanController.kegiatanPage);
// kegiatanRoute.post('/kegiatan', protect, kegiatanController.createKegiatan);

kegiatanRoute.get('/add_kegiatan',protect, kegiatanController.addKegiatanPage);


// Route untuk submit form tambah kegiatan (POST)
kegiatanRoute.post('/kegiatan',protect, upload.single('foto_kegiatan'), kegiatanController.createKegiatan); // Menangani file upload dan memproses data

kegiatanRoute.delete('/kegiatan/:id', protect,kegiatanController.deleteKegiatan);

// Route to render the edit page
kegiatanRoute.get('/kegiatan/edit/:id',protect, kegiatanController.editKegiatanPage);

// Route to handle the form submission for updating
kegiatanRoute.post('/kegiatan/:id', protect,upload.single('foto_kegiatan'), kegiatanController.updateKegiatan);

export default kegiatanRoute;