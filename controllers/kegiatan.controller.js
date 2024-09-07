/* eslint-disable no-useless-catch */
import * as kegiatanServices from '../services/kegiatan.services.js';
import { ref, getDownloadURL, uploadBytesResumable, getStorage, deleteObject } from "firebase/storage"; // Pastikan ini sudah di-import
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase Auth
import Kegiatan from '../models/kegiatan.model.js'; // Import model Kegiatan
import { auth } from '../config/firebaseConfig.js'; // Sesuaikan dengan path modul Anda
import { config } from 'dotenv';
config();


export const kegiatanPage = async (req, res) => {
    const title = "Data Kegiatan";
    try {
        const messageCreateSuccess = await req.flash('messageCreateSuccess');
        const messageDeleteSuccess = await req.flash('messageDeleteSuccess');
        const messageUpdateSuccess = await req.flash('messageUpdateSuccess');
        const kegiatanData = await Kegiatan.find();

        // Pastikan data kegiatan diambil dengan benar
        // console.log('Kegiatan Data:', kegiatanData);

        res.render('data_kegiatan', {
            title,
            kegiatanData,
            messageCreateSuccess,
            messageDeleteSuccess,
            messageUpdateSuccess
        });
    } catch (error) {
        console.error('Error fetching kegiatan data:', error);
        res.status(500).send('Internal Server Error');
    }
};



// Fungsi untuk mengunggah file gambar ke Firebase Storage dan menyimpan data teks ke MongoDB
async function uploadSingleImage(file, kegiatanData) {
    try {
        const pass = process.env.FIREBASE_PASS;
        const user = process.env.FIREBASE_USER;

        // Sign in to Firebase
        await signInWithEmailAndPassword(auth, user, pass);

        const dateTime = Date.now();
        let uploadedFileName = null;

        // Validasi dan upload file jika ada
        if (file) {
            // Validasi apakah file adalah gambar
            const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validImageTypes.includes(file.mimetype)) {
                throw new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.');
            }

            const fileName = `images/${dateTime}_${file.originalname}`;
            const storageRef = ref(getStorage(), fileName);
            const metadata = { contentType: file.mimetype }; // Metadata untuk gambar

            const uploadTask = await uploadBytesResumable(storageRef, file.buffer, metadata);

            // Mendapatkan URL dari file yang di-upload
            uploadedFileName = await getDownloadURL(uploadTask.ref);
        }

        // Save kegiatan to MongoDB
        const newKegiatan = new Kegiatan({
            nama_kegiatan: kegiatanData.nama_kegiatan,
            tanggal_kegiatan: kegiatanData.tanggal_kegiatan,
            deskripsi_kegiatan: kegiatanData.deskripsi_kegiatan,
            foto_kegiatan: uploadedFileName, // Simpan URL gambar
        });

        await newKegiatan.save();
        return uploadedFileName;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}

export const createKegiatan = async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['nama_kegiatan', 'tanggal_kegiatan', 'deskripsi_kegiatan'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).send(`Field '${field}' is required`);
            }
        }

        const kegiatanData = {
            nama_kegiatan: req.body.nama_kegiatan,
            tanggal_kegiatan: req.body.tanggal_kegiatan,
            deskripsi_kegiatan: req.body.deskripsi_kegiatan,
        };

        // Call the upload function for images
        const uploadedFileName = await uploadSingleImage(req.file, kegiatanData);

        req.flash('successUpHse', 'Data Kegiatan berhasil di upload');

        console.log(`Upload success, file name: ${uploadedFileName}`);

        // Redirect or respond
        res.redirect('/adm/data/kegiatan');
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Internal Server Error');
    }
};


export const addKegiatanPage = async(req,res)=>{
    const title = "Tambah Kegiatan"
    try {
        res.render('add_kegiatan',{
            title
        });
    } catch (error) {
        throw error;
    }
}


export const deleteKegiatan = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the Kegiatan by ID
        const kegiatan = await Kegiatan.findById(id);

        if (!kegiatan) {
            return res.status(404).send('Kegiatan tidak ditemukan');
        }

        // If there is a photo, delete it from Firebase Storage
        if (kegiatan.foto_kegiatan) {
            const storage = getStorage(); // Initialize Firebase Storage
            const storageRef = ref(storage, kegiatan.foto_kegiatan);

            // Delete the file from Firebase Storage
            await deleteObject(storageRef);
        }

        // Delete the Kegiatan from MongoDB
        await Kegiatan.findByIdAndDelete(id);

        // Send success response
        res.status(200).send('Kegiatan berhasil dihapus');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Terjadi kesalahan saat menghapus kegiatan');
    }
};

export const editKegiatanPage = async (req, res) => {
    const title = "Edit Kegiatan";
    try {
        const { id } = req.params;
        const kegiatan = await Kegiatan.findById(id);

        if (!kegiatan) {
            return res.status(404).send('Kegiatan tidak ditemukan');
        }

        res.render('edit_kegiatan', {
            title,
            kegiatan
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat memuat halaman edit');
    }
};

export const updateKegiatan = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama_kegiatan, tanggal_kegiatan, deskripsi_kegiatan } = req.body;
        const file = req.file;

        // Find the Kegiatan by ID
        const kegiatan = await Kegiatan.findById(id);

        if (!kegiatan) {
            return res.status(404).send('Kegiatan tidak ditemukan');
        }

        // If there's a new file, upload it and update the reference
        if (file) {
            const dateTime = Date.now();
            const fileName = `images/${dateTime}_${file.originalname}`;
            const storageRef = ref(getStorage(), fileName);
            const metadata = { contentType: file.mimetype };
            const uploadTask = await uploadBytesResumable(storageRef, file.buffer, metadata);
            const newFileUrl = await getDownloadURL(uploadTask.ref);

            // Delete old file from Firebase Storage if it exists
            if (kegiatan.foto_kegiatan) {
                const oldStorageRef = ref(getStorage(), kegiatan.foto_kegiatan);
                await deleteObject(oldStorageRef);
            }

            kegiatan.foto_kegiatan = newFileUrl;
        }

        // Update Kegiatan details
        kegiatan.nama_kegiatan = nama_kegiatan;
        kegiatan.tanggal_kegiatan = tanggal_kegiatan;
        kegiatan.deskripsi_kegiatan = deskripsi_kegiatan;

        await kegiatan.save();

        req.flash('successUpHse', 'Kegiatan berhasil diperbarui');
        res.redirect('/adm/data/kegiatan');
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat memperbarui kegiatan');
    }
};