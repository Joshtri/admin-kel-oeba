import express from "express";
import { createPengumuman, } from "../controllers/pengumuman.controller.js";
const pengumumanRoute = express.Router();



pengumumanRoute.post('/pengumuman',createPengumuman);


export default pengumumanRoute;