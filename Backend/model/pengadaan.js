const mongoose = require("mongoose");

const PengadaanSchema = new mongoose.Schema({
    tanggalOrder: { type: Date, default: Date.now }, // kapan pesanan dibuat //
    supplier: { type: String, required: true }, 
    status: { 
        type: String, 
        enum: ["Draft", "Dipesan", "Diterima", "Dibatalkan"], 
        default: "Draft" 
    }, 
    barang: [
        {
            barangId: { type: String, required: true  },
            jumlah: { type: Number, required: true },
            hargaSatuan: { type: Number, required: true }
        }
    ],
    totalHarga: { type: Number, required: true },
    estimasiKedatangan: { type: Date }, // perkiraan barang tiba //
    catatan: { type: String }
});

const Pengadaan = mongoose.model("Pengadaan", PengadaanSchema);
module.exports = Pengadaan;
