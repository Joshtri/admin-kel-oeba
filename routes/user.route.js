import express from "express";
import * as userController from '../controllers/user.controller.js'
const userRoute = express.Router();
import protect from "../config/auth/protect.js";

userRoute.get('/user',protect, userController.userPage);
userRoute.post('/user',protect, userController.createUser);

// DELETE /user/:userId
userRoute.delete('/user/:userId',protect, userController.deleteUser);

export default userRoute;
