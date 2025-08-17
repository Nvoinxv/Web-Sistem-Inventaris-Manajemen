const Pengadaan_controller = require("../controller/PengadaanController");
const express = require("express");
const router = express.Router();
const pengadaan = require("../model/pengadaan")

router.post("/buat-pengadaan", Pengadaan_controller.buatPengadaan);
router.post("/lihat-pengadaan", Pengadaan_controller.lihatPengadaan);

router.get("/lihat-pengadaan/:id", async (req, res) => {
    try {
        console.log("ID diterima dari params:", req.params.id);
        const Pengadaan = await pengadaan.findById(req.params.id);

        if (!Pengadaan) {
            console.log("Produk tidak di temukan di database");
            return res.status(404).json({ error: "Produk tidak ada" });
        }
        res.json(Pengadaan);
    } catch (err) {
        console.error("Error saat ambil pengadaan:", err);
        res.status(500).json({ error: err.message });
    }
})

// Fix: Hapus route PUT yang tidak digunakan dan perbaiki route POST
router.post("/update-status-pengadaan", async (req, res) => {
    try {
        console.log("Body yang di terima:", req.body);
        const {id, supplier, barang, catatan, totalHarga, estimasiKedatangan} = req.body;
        
        // Fix: Handle estimasi kedatangan dengan benar
        let estimasiDate = null;
        if (estimasiKedatangan) {
            // Jika format YYYY-MM-DD, convert ke Date
            if (typeof estimasiKedatangan === 'string' && estimasiKedatangan.includes('-')) {
                const [year, month, day] = estimasiKedatangan.split('-');
                estimasiDate = new Date(year, month - 1, day, 0, 0, 0);
            } else {
                estimasiDate = new Date(estimasiKedatangan);
            }
        }
                 
        const updatePengadaan = await pengadaan.findByIdAndUpdate(
            id,
            {
                supplier, 
                barang, 
                catatan, 
                totalHarga, 
                estimasiKedatangan: estimasiDate
            },
            {new: true}
        );

        if (!updatePengadaan) {
            return res.status(404).json({error:"Pengadaan tidak di temukan!"});
        }

        res.json({
            message: "Pengadaan berhasil di update",
            data: updatePengadaan
        });
    } catch (err) {
        console.error("Error saat update pengadaan:", err);
        res.status(500).json({ error: err.message });
    }
});

router.post("/hapus-pengadaan", Pengadaan_controller.hapusPengadaan);

module.exports = router;