import React from "react";
import edit_produkHook from "../Hook/edit_produkHook";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditProduk() {
    const {loading, error, successMessage, updatedProduct, editProduk} = edit_produkHook();
    const [fromData, setFormData] = React.useState({
        nama: "",
        harga: "",
        stok: "",
        kategori: "",
        Deskripsi: "",
    });
    const { id } = useParams();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    React.useEffect(() => {
      const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/barang/daftar-produk/${id}`);
        setFormData(res.data);
         console.log("Data produk:", res.data);
      } catch (err) {
        console.error("Gagal ambil data produk", err);
      }
    };
    fetchData();
  }, [id]);

  const handleClick = () => {
    navigate("/daftar-produk");
  }

  const handleCancel = () => {
    handleClick();
  }

  const handleSubmit = (e) => {
    e.preventDefault(); 

    const produkData = {
      id: fromData._id, 
      nama: fromData.nama,
      harga: Number(fromData.harga),
      stok: Number(fromData.stok),
      kategori: fromData.kategori,
      Deskripsi: fromData.Deskripsi
    };

    editProduk(produkData);

    setTimeout(() => {
      handleClick();
      }, 500);
    };

  return (
    <div className="tambah-produk-container">
      <div className="grid-pattern"></div>
      <div className="tambah-produk-header">
        <div className="tambah-produk-icon"></div>
        <h1 className="tambah-produk-title">Edit Produk</h1>
        <p className="tambah-produk-subtitle">Edit produk yang Anda jual</p>
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
              value={fromData.nama}
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
                value={fromData.harga}
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
                value={fromData.stok}
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
              value={fromData.Deskripsi}
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
              value={fromData.kategori}
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
              {loading ? "Loading..." : "Kumpulkan edit"}
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
  )
}