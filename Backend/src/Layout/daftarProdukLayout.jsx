import React from "react";
import daftar_produkHook from "../Hook/daftar_produkHook";
import { useNavigate } from "react-router-dom";
import "../Styles/daftar-produk.css"; 
import Axios from "axios";

export default function DaftarProdukLayout() {
  const { produk, loading, error, fetchProduk } = daftar_produkHook();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/tambah-produk");
  };

  const handleClickHome = () => {
    navigate("/")
  }

  const handleClickPengadaan = () => {
    navigate("/lihat-pengadaan");
  }

  const handleClickEditProduk = (produkId) => {
    navigate(`/edit-produk/${produkId}`);
  };


  const handleDelete = async (produkId) => {
    if (!window.confirm("Yakin mau hapus produk ini?")) 
      return;

    try {
      await Axios.post("http://localhost:3000/api/barang/hapus-produk", {
        id: produkId,
      });
      fetchProduk();
    } catch (err) {
      console.error("Gagal hapus produk:", err);
      alert("Gagal hapus produk");
    }
  };

  return (
    <div className="produk-container">
      {/* Background grid pattern */}
      <div className="grid-pattern"></div>

      {/* Header Section */}
      <div className="produk-header">
        <div className="produk-header-icon"></div>
        <h1 className="produk-title">Daftar Produk Inventaris</h1>
        <p className="produk-subtitle">
          Daftar Produk yang ada di Sistem Manajemen Inventaris
        </p>
      </div>

      {/* Controls */}
      <div className="produk-controls">
        <button
          className={`refresh-button ${loading ? "loading" : ""}`}
          onClick={fetchProduk}
          disabled={loading}
        >
          {loading ? "Memuat..." : "Muat Ulang"}
        </button>

        <button className="refresh-button" onClick={handleClick}>
          Tambah Produk
        </button>
 
        <button className="refresh-button" onClick={handleClickHome}>
          Halaman Utama
        </button>

        <button className="refresh-button" onClick={handleClickPengadaan}>
          Pengadaan
        </button>
      </div>
      

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Sedang memuat data...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-text">{error}</div>
        </div>
      )}

      {/* Produk Grid */}
      {!loading && !error && (
        <>
          {produk.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <div className="empty-text">Belum ada produk</div>
              <div className="empty-subtext">
                Silakan tambahkan produk baru ke inventaris.
              </div>
            </div>
          ) : (
            <ul className="produk-grid">
              {produk.map((item, index) => (
                <li className="produk-card" key={index}>
                  <div className="produk-item-header">
                    <div className="produk-icon">📦</div>
                    <h2 className="produk-nama">{item.nama}</h2>
                  </div>
                  <div className="produk-details">
                    <div className="produk-detail-item">
                      <span className="detail-label harga">Harga</span>
                      <span className="detail-value harga-value">
                        Rp {item.harga}
                      </span>
                    </div>
                    <div>
                    </div>
                    <div className="produk-detail-item">
                      <span className="detail-label stok">Stok</span>
                      <span
                        className={`stok-value ${
                          item.stok > 50
                            ? "stok-tinggi"
                            : item.stok > 10
                            ? "stok-sedang"
                            : "stok-rendah"
                        }`}
                      >
                        {item.stok}
                      </span>
                    </div>
                  </div>
                  <div className="produk-actions">
                    <button
                        className="action-button action-edit"
                          onClick={() => handleClickEditProduk(item._id)}
                        >
                          Edit
                        </button>
                    <button className="action-button action-delete"
                    onClick={() => handleDelete(item._id)}>
                      Hapus
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
