import express from "express";
const dashboardRoute = express.Router();
import * as dashboardController from "../controllers/dashboard.controller.js";

import protect from "../config/auth/protect.js";
import { updateUser, updateUserPassword } from "../controllers/user.controller.js";


dashboardRoute.get('/main/dashboard', protect, dashboardController.dashboardPage);

dashboardRoute.get('/main/informasi_akun', protect,dashboardController.informasiAkunPage);

// Route for updating password
dashboardRoute.post('/update_password', protect,updateUserPassword);

// Route to update user details
dashboardRoute.post('/update_user', protect,updateUser);


dashboardRoute.get('/logout', protect, dashboardController.logoutUser);

export default dashboardRoute;