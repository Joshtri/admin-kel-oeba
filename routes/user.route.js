import express from "express";
import { userPage } from "../controllers/user.controller.js";
const userRoute = express.Router();



userRoute.get('/user',userPage )


export default userRoute;