const barang = require('../model/barang');
const path = require("path");
const multer = require("multer");

const daftar_produk = async (req, res) => {
  try {
    const produk = await barang.find({});  // ambil semua produk //
    res.status(200).json({ data: produk });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const tambah_produk = async (req, res) => {
  const { nama, harga, stok, kategori, Deskripsi } = req.body || {};
  console.log(req.body);

  // Validasi sederhana //
  if (!nama || !harga || !stok || !kategori || !Deskripsi) {
    return res.status(400).json({ error: 'Semua field wajib diisi dengan benar' });
  }
  
  try {
    // Buat produk baru dengan data dari req.body //
    const produkBaru = new barang({
      nama,
      harga,
      stok,
      kategori,
      Deskripsi,
    });

    // Simpan ke DB //
    const savedProduk = await produkBaru.save();

    res.status(201).json({ message: 'Produk berhasil ditambahkan', data: savedProduk });
  } catch (err) {
    console.error("Error simpan produk:", err);  
    res.status(500).json({ error: err.message });
  }
};

const Hapus_produk = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID produk wajib diisi' });
  }

  try {
    const deleted = await barang.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    res.status(200).json({ message: 'Produk berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const edit_produk = async (req, res) => {
  const { id } = req.body || {};
  const { nama, harga, stok, kategori, Deskripsi } = req.body || {};

  console.log("Data update produk:", req.body);

  // Validasi sederhana //
  if (!id || !nama || !harga || !stok || !kategori || !Deskripsi) {
    return res.status(400).json({ error: 'Semua field wajib diisi dengan benar termasuk ID produk' });
  }

  try {
    // Update produk sesuai ID //
    const updatedProduk = await barang.findByIdAndUpdate(
      id,
      { nama, harga, stok, kategori, Deskripsi },
      { new: true } // Supaya return data terbaru setelah update //
    );

    if (!updatedProduk) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    res.status(200).json({ message: 'Produk berhasil diperbarui', data: updatedProduk });
  } catch (err) {
    console.error("Error update produk:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  daftar_produk,
  tambah_produk,
  Hapus_produk,
  edit_produk
};
