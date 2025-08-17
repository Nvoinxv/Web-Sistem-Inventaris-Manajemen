const BarangController = require("../controller/BarangController");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const barang = require("../model/barang");

const upload = multer();

router.post("/daftar-produk", BarangController.daftar_produk);
// GET produk berdasarkan ID //
router.get("/daftar-produk/:id", async (req, res) => {
    try {
        console.log("ID diterima dari params:", req.params.id);
        const produk = await barang.findById(req.params.id);
        if (!produk) {
            console.log("Produk tidak ditemukan di database");
            return res.status(404).json({ error: "Produk tidak ditemukan" });
        }
        res.json(produk);
    } catch (err) {
        console.error("Error saat ambil produk:", err);
        res.status(500).json({ error: err.message });
    }
});

// UPDATE produk berdasarkan ID database mongodb //
router.put("/edit-produk/:id", async (req, res) => {
    try {
        const { nama, harga, stok, kategori, deskripsi } = req.body;

        const updateProduk = await barang.findByIdAndUpdate(
            req.params.id,
            { nama, harga, stok, kategori, deskripsi },
            { new: true } // return data terbaru //
        );

        if (!updateProduk) {
            return res.status(404).json({ error: "Produk tidak ditemukan" });
        }

        res.json({
            message: "Produk berhasil diupdate",
            data: updateProduk
        });
    } catch (err) {
        console.error("Error saat update produk:", err);
        res.status(500).json({ error: err.message });
    }
});

router.post("/tambah-produk", upload.none(), BarangController.tambah_produk);
router.post("/hapus-produk", BarangController.Hapus_produk);
router.put("/edit-produk", upload.none(), async (req, res) => {
    try {
        console.log("Body yang diterima:", req.body);
        const { id, nama, harga, stok, kategori, deskripsi } = req.body;

        const updateProduk = await barang.findByIdAndUpdate(
            id,
            { nama, harga, stok, kategori, deskripsi },
            { new: true }
        );

        if (!updateProduk) {
            return res.status(404).json({ error: "Produk tidak ditemukan" });
        }

        res.json({
            message: "Produk berhasil diupdate",
            data: updateProduk
        });
    } catch (err) {
        console.error("Error saat update produk:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
