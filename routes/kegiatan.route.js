import express from "express";
const kegiatanRoute = express.Router();
import * as kegiatanController from "../controllers/kegiatan.controller.js";
import protect from "../config/auth/protect.js";

kegiatanRoute.get('/kegiatan', protect, kegiatanController.kegiatanPage);
kegiatanRoute.post('/kegiatan', protect, kegiatanController.createKegiatan);

kegiatanRoute.get('/add_kegiatan',protect, kegiatanController.addKegiatanPage);

kegiatanRoute.delete('/kegiatan/:id',protect, kegiatanController.deleteKegiatan);

// Route to update kegiatan
kegiatanRoute.get('/edit_kegiatan/:id',protect, kegiatanController.updateKegiatanPage);

kegiatanRoute.put('/update_kegiatan/:id',protect, kegiatanController.updateDataKegiatan);



export default kegiatanRoute;