import express from "express";
import { kegiatanPage } from "../controllers/kegiatan.controller.js";
const kegiatanRoute = express.Router();



kegiatanRoute.get('/', kegiatanPage)


export default kegiatanRoute;