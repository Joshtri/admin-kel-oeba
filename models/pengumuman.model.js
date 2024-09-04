import mongoose from "mongoose";

const pengumumanSchema = new mongoose.Schema({
    judul_pengumuman: {
        type: String,
        required: true,
    },

    tanggal_pengumuman: {
        type: Date,
        required: true,
    },

    deskripsi_pengumuman: {
        type: String,
        required: true,
    },

    berkas_pengumuman_pdf: {
        type: String,
        // required: true,
    },

});


const Pengumuman = mongoose.model('Pengumuman', pengumumanSchema);

export default Pengumuman;