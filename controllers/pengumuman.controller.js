import { getStorage, ref, list, deleteObject ,uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebaseConfig.js'; // Sesuaikan dengan path modul Anda
import Pengumuman from '../models/pengumuman.model.js';


// Fungsi untuk mengunggah file PDF ke Firebase Storage dan menyimpan data teks ke MongoDB
async function uploadSinglePDF(files, pengumumanData) {
    try {
        // Sign in ke Firebase jika belum
        // eslint-disable-next-line no-undef
        await signInWithEmailAndPassword(auth, process.env.FIREBASE_USER, process.env.FIREBASE_AUTH);

        // Mendapatkan timestamp untuk nama file unik
        const dateTime = Date.now();

        // Membuat array untuk menyimpan nama file hasil upload
        const uploadedFileNames = [];

        // Loop melalui setiap file dan mengunggah ke Firebase Storage
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileName = `pdf/${dateTime}_${i + 1}`;
            const storageRef = ref(getStorage(), fileName);
            const metadata = {
                contentType: file.mimetype,
            };
            await uploadBytesResumable(storageRef, file.buffer, metadata);
            uploadedFileNames.push(fileName);
        }

        // Menyimpan data HSEPlan ke MongoDB dengan path file yang diunggah
        const newPengumuman = new Pengumuman({
            judul_pengumuman: pengumumanData.judul_pengumuman,
            tanggal_pengumuman: pengumumanData.tanggal_pengumuman,
            deskripsi_pengumuman: pengumumanData.deskripsi_pengumuman,

            berkas_pengumuman_pdf: uploadedFileNames[0],
            // file2: uploadedFileNames[1],
            // file3: uploadedFileNames[2],
            // file4: uploadedFileNames[3],


        });

        // Menyimpan data HSEPlan ke MongoDB
        await newPengumuman.save();

        return uploadedFileNames;
    } catch (error) {
        console.error(error); // Mencetak kesalahan ke konsol
        throw error;
    }
}

export const createPengumuman = async (req, res) => {
    try {
        // Validasi apakah semua properti yang diperlukan telah disertakan dalam request body
        const requiredFields = ['judul_pengumuman', 'tanggal_pengumuman', 'deskripsi_pengumuman'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).send(`Field '${field}' is required`);
            }
        }

        const pengumumanData = {
            judul_pengumuman: req.body.judul_pengumuman,
            tanggal_pengumuman: req.body.tanggal_pengumuman,
            deskripsi_pengumuman: req.body.deskripsi_pengumuman,

        };

        // Memanggil fungsi untuk mengunggah file PDF dan menyimpan data HSEPlan
        const uploadedFileNames = await uploadSinglePDF(req.files, pengumumanData);
        await req.flash('successUpHse', 'Data Pengumuman berhasil di upload');

        console.log(`berhasil upload`);

        // Redirect atau berikan respons sesuai kebutuhan Anda
        res.redirect('/form_mitra'); // Ganti rute ini sesuai dengan kebutuhan Anda
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


export const getPengumuman = async(req,res)=>{
    const title = "Data Pengumuman";
    try {

        res.render('data_pengumuman',{
            title
        })
    } catch (error) {
        console.log(error);
        throw error;
    }

}

export const addPengumuman = async(req,res)=>{
    const title = "Add Pengumuman";
    try {

        res.render('add_pengumuman',{
            title
        })
    } catch (error) {
        console.log(error);
        throw error;
    }

}