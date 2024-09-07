import { getStorage, ref, list, deleteObject ,uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebaseConfig.js'; // Sesuaikan dengan path modul Anda
import Pengumuman from '../models/pengumuman.model.js';

// Fungsi untuk mengunggah file PDF ke Firebase Storage dan menyimpan data teks ke MongoDB
async function uploadSinglePDF(file, pengumumanData) {
    try {
        // Sign in to Firebase
        await signInWithEmailAndPassword(auth, 'stuffofyos1516@gmail.com', 'oebaisthebestloh');

        const dateTime = Date.now();
        let uploadedFileName = null;

        // Upload file jika ada
        if (file) {
            const fileName = `pdf/${dateTime}_${file.originalname}`;
            const storageRef = ref(getStorage(), fileName);
            const metadata = { contentType: file.mimetype };
            const uploadTask = await uploadBytesResumable(storageRef, file.buffer, metadata);

            // Mendapatkan URL dari file yang di-upload
            uploadedFileName = await getDownloadURL(uploadTask.ref);
        }

        // Save announcement to MongoDB
        const newPengumuman = new Pengumuman({
            judul_pengumuman: pengumumanData.judul_pengumuman,
            tanggal_pengumuman: pengumumanData.tanggal_pengumuman,
            deskripsi_pengumuman: pengumumanData.deskripsi_pengumuman,
            berkas_pengumuman_pdf: uploadedFileName,
        });

        await newPengumuman.save();
        return uploadedFileName;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}



export const createPengumuman = async (req, res) => {
    try {
        // Validate required fields
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

        // Call the upload function
        const uploadedFileName = await uploadSinglePDF(req.file, pengumumanData);

        req.flash('successUpHse', 'Data Pengumuman berhasil di upload');

        console.log(`Upload success, file name: ${uploadedFileName}`);

        // Redirect or respond
        res.redirect('/adm/data/pengumuman');
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Internal Server Error');
    }
};


export const getPengumuman = async(req,res)=>{
    const title = "Data Pengumuman";
    try {

        const pengumumanData = await Pengumuman.find();

        res.render('data_pengumuman',{
            title,
            pengumumanData
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

export const deletePengumuman = async (req, res) => {
    try {
        const { id } = req.params;

        // Temukan pengumuman berdasarkan ID
        const pengumuman = await Pengumuman.findById(id);

        if (!pengumuman) {
            return res.status(404).send('Pengumuman tidak ditemukan');
        }

        // Jika ada berkas PDF, hapus dari Firebase Storage
        if (pengumuman.berkas_pengumuman_pdf) {
            const storage = getStorage();
            const storageRef = ref(storage, pengumuman.berkas_pengumuman_pdf);

            // Hapus file dari Firebase Storage
            await deleteObject(storageRef);
        }

        // Hapus data pengumuman dari MongoDB
        await Pengumuman.findByIdAndDelete(id);

        // Kirimkan respons sukses
        res.status(200).send('Pengumuman berhasil dihapus');
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat menghapus pengumuman');
    }
};