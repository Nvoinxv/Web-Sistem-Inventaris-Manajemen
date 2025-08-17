const Pengadaan = require("../model/pengadaan");
const Barang = require("../model/barang"); 

// Buat pengadaan baru //
const buatPengadaan = async (req, res) => {
    try {
        const { supplier, barang, estimasiKedatangan, catatan } = req.body;

        // Hitung total harga //
        const totalHarga = barang.reduce((total, item) => {
            return total + (item.jumlah * item.hargaSatuan);
        }, 0);

        const pengadaanBaru = new Pengadaan({
            supplier,
            barang,
            totalHarga,
            estimasiKedatangan,
            catatan
        });

        await pengadaanBaru.save();
        res.status(201).json({ message: "Pengadaan berhasil dibuat", data: pengadaanBaru });
    } catch (error) {
        console.error("=== ERROR di Buat Pengadaan ===");
        console.error(error);
        res.status(500).json({ message: "Gagal membuat pengadaan", error: error.message });
    }
};

// Lihat semua pengadaan //
const lihatPengadaan = async (req, res) => {
    try {
        const data = await Pengadaan.find().populate("barang.barangId", "nama harga");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data pengadaan", error: error.message });
    }
};

// Update status pengadaan //
const updateStatusPengadaan = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const pengadaan = await Pengadaan.findById(id);
        if (!pengadaan) {
            return res.status(404).json({ message: "Pengadaan tidak ditemukan" });
        }

        pengadaan.status = status;

        // Kalau status jadi "Diterima", update stok barang //
        if (status === "Diterima") {
            for (let item of pengadaan.barang) {
                await Barang.findByIdAndUpdate(
                    item.barangId,
                    { $inc: { stok: item.jumlah } }, // tambah stok //
                    { new: true }
                );
            }
        }

        await pengadaan.save();
        res.status(200).json({ message: "Status pengadaan diperbarui", data: pengadaan });
    } catch (error) {
        res.status(500).json({ message: "Gagal update status pengadaan", error: error.message });
    }
};

// Hapus pengadaan //
const hapusPengadaan = async (req, res) => {
    try {
        const { id } = req.params;
        await Pengadaan.findByIdAndDelete(id);
        res.status(200).json({ message: "Pengadaan berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus pengadaan", error: error.message });
    }
};

module.exports = {
    buatPengadaan,
    lihatPengadaan,
    updateStatusPengadaan,
    hapusPengadaan
};