import express from "express";
import { addPengumuman, createPengumuman, getPengumuman, } from "../controllers/pengumuman.controller.js";
const pengumumanRoute = express.Router();


pengumumanRoute.get('/pengumuman',getPengumuman)
pengumumanRoute.get('/add_pengumuman',addPengumuman)
pengumumanRoute.post('/pengumuman',createPengumuman);


export default pengumumanRoute;