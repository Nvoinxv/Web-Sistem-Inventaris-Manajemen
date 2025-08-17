import tambah_stokHook from "../Hook/tambah_stokHook";
import React from "react";
import "../Styles/tambah_produk.css"; 
import { useNavigate } from "react-router-dom";

export default function TambahProduk() {
  const { loading, error, successMessage, updatedProduct, tambahProduk } = tambah_stokHook();
  const [formData, setFormData] = React.useState({
    nama: "",
    harga: "",
    stok: "",
    kategori: "",
    Deskripsi: "",
  });
  const navigate = useNavigate();

  // Fungsi handleChange supaya input form bisa update formData //
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCancel = () => {
    // Reset data //
    setFormData({
        nama: "",
        harga: "",
        stok: "",
        kategori: "",
        Deskripsi: "",
    });
    handleClick();
  };

  const handleClick = () => {
    navigate("/daftar-produk")
  }

  // Fungsi submit untuk handle form submit dan panggil tambahStok //
  const handleSubmit = (e) => {
    e.preventDefault(); 

    // Convert harga dan stok ke number //
    const produkData = {
      ...formData,
      harga: Number(formData.harga),
      stok: Number(formData.stok),
    };

    tambahProduk(produkData);
    setTimeout(() => {
      handleClick();
    }, 500);
  };

  return (
    <div className="tambah-produk-container">
      <div className="grid-pattern"></div>
      <div className="tambah-produk-header">
        <div className="tambah-produk-icon"></div>
        <h1 className="tambah-produk-title">Tambah Produk</h1>
        <p className="tambah-produk-subtitle">Tambahkan Produk yang ingin Anda jual</p>
      </div>

      {/* Pesan sukses / error */}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">{error}</div>}
      
      {/* Data produk yang baru ditambahkan / diupdate */}
      {updatedProduct && (
        <div className="success-message" style={{ marginTop: "20px" }}>
          <div><strong>Nama:</strong> {updatedProduct.nama}</div>
          <div><strong>Harga:</strong> Rp {updatedProduct.harga}</div>
          <div><strong>Stok:</strong> {updatedProduct.stok}</div>
          {updatedProduct.gambar && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={updatedProduct.gambar}
                alt={updatedProduct.nama}
                style={{
                  maxWidth: "200px",
                  borderRadius: "12px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Form */}
      <div className="tambah-produk-form-container">
        <form className="tambah-produk-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Produk</label>
            <input 
              type="text" 
              name="nama"
              className="form-input" 
              placeholder="Masukkan nama produk" 
              value={formData.nama}
              onChange={handleChange}
              required
            />
            <span className="input-highlight"></span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Harga</label>
              <input 
                type="number" 
                name="harga"
                className="form-input" 
                placeholder="Masukkan harga" 
                value={formData.harga}
                onChange={handleChange}
                required
                min="0"
              />
              <span className="input-highlight"></span>
            </div>
            <div className="form-group">
              <label className="form-label">Stok</label>
              <input 
                type="number" 
                name="stok"
                className="form-input" 
                placeholder="Masukkan stok" 
                value={formData.stok}
                onChange={handleChange}
                required
                min="0"
              />
              <span className="input-highlight"></span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi</label>
            <textarea 
              name="Deskripsi"
              className="form-textarea" 
              placeholder="Masukkan deskripsi produk" 
              value={formData.Deskripsi}
              onChange={handleChange}
              required
            ></textarea>
            <span className="input-highlight"></span>
          </div>

          <div className="form-group">
            <label className="form-label">Kategori</label>
            <select 
              name="kategori" 
              className="form-select"
              value={formData.kategori}
              onChange={handleChange}
              required
            >
              <option value="">Pilih kategori</option>
              <option value="elektronik">Elektronik</option>
              <option value="fashion">Fashion</option>
              <option value="Makanan">Makanan</option>
              <option value="Minuman">Minuman</option>
            </select>
          </div>

          {/* Tombol */}
          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Loading..." : "Tambah Produk"}
            </button>
            <button type="button" className="cancel-button" disabled={loading} onClick={handleCancel}>
              Batal
            </button>
          </div>
        </form>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner-large"></div>
            <div className="loading-text">Memproses...</div>
          </div>
        </div>
      )}
    </div>
  );
}
