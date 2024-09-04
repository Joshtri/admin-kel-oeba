/* eslint-disable no-useless-catch */
import * as kegiatanServices from '../services/kegiatan.services.js';

import Kegiatan from '../models/kegiatan.model.js';

export const kegiatanPage = async(req,res)=>{
    const title = "Data Kegiatan"
    try {
        
        const messageCreateSuccess = await req.flash('messageCreateSuccess');
        const messageDeleteSuccess = await req.flash('messageDeleteSuccess');
        const messageUpdateSuccess = await req.flash('messageUpdateSuccess');
        const kegiatanData = await kegiatanServices.getAllKegiatan();
        res.render('data_kegiatan',{
            title,
            kegiatanData,
            messageCreateSuccess,
            messageDeleteSuccess,
            messageUpdateSuccess
        });
    } catch (error) {
        throw error;
    }

};
