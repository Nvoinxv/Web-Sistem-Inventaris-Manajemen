import React from "react";
import useLihatPengadaan from "../Hook/lihatPengadaanHook";
import "../Styles/LihatPengadaan.css";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

export default function LihatPengadaan() {
  const { pengadaan, loading, error, fetchPengadaan, setPengadaan } = useLihatPengadaan();
  const navigate = useNavigate();
  
  // Navigasi //
  const handleClickHome = () => navigate("/");
  const handleClickTambahPengadaan = () => navigate("/buat-pengadaan");
  const handleClickEdirPengadaan = (pengadaanId) => {
      navigate(`/edit-status-pengadaan/${pengadaanId}`);
  };

  // Hapus pengadaan //
  const handleDelete = async (pengadaanId) => {
    if (!window.confirm("Yakin mau hapus pengadaan ini?")) return;
 
    try {
      const res = await Axios.post("http://localhost:3000/api/pengadaan/hapus-pengadaan", {
      _id: pengadaanId,  
      });
      console.log("Respon hapus:", res.data);
      setPengadaan((prev) => prev.filter((item) => item._id.toString() !== pengadaanId.toString()));
      } catch (err) {
          console.error("Gagal hapus pengadaan:", err.response?.data || err.message);
          alert("Gagal hapus pengadaan");
        }
      };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status color class
  const getStatusClass = (status) => {
    switch (status) {
      case 'Draft': return 'status-draft';
      case 'Dipesan': return 'status-dipesan';
      case 'Diterima': return 'status-diterima';
      case 'Dibatalkan': return 'status-dibatalkan';
      default: return 'status-draft';
    }
  };

  return (
    <div className="pengadaan-container">
      {/* Background grid */}
      <div className="grid-pattern"></div>

      {/* Header */}
      <div className="pengadaan-header">
        <div className="pengadaan-header-icon"></div>
        <h1 className="pengadaan-title">Daftar Pengadaan Inventaris</h1>
        <p className="pengadaan-subtitle">
          Daftar Pengadaan yang ada di Sistem Manajemen Inventaris
        </p>
      </div>

      {/* Tombol kontrol */}
      <div className="pengadaan-controls">
        <button
          className={`refresh-button ${loading ? "loading" : ""}`}
          onClick={fetchPengadaan}
          disabled={loading}
        >
          {loading ? "Memuat..." : "Muat Ulang"}
        </button>

        <button className="refresh-button" onClick={handleClickTambahPengadaan}>
          Tambah Pengadaan
        </button>

        <button className="refresh-button" onClick={handleClickHome}>
          Halaman Utama
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner-large"></div>
            <div className="loading-text">Sedang memuat data...</div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-text">{error}</div>
        </div>
      )}

      {/* List pengadaan */}
      {!loading && !error && (
        <>
          {pengadaan.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <div className="empty-text">Belum ada pengadaan</div>
              <div className="empty-subtext">
                Silakan tambahkan pengadaan baru ke sistem.
              </div>
            </div>
          ) : (
            <ul className="pengadaan-grid">
              {pengadaan.map((pengadaanItem, index) => (
                <li className="pengadaan-card" key={pengadaanItem._id} style={{animationDelay: `${index * 0.1}s`}}>
                  {/* Card Header */}
                  <div className="pengadaan-item-header">
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <div className="pengadaan-icon">📦</div>
                      <div>
                        <h3 className="pengadaan-nama">
                          Pengadaan #{pengadaanItem._id.slice(-6)}
                        </h3>
                        <div className={`status-badge ${getStatusClass(pengadaanItem.status)}`}>
                          {pengadaanItem.status}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pengadaan Details */}
                  <div className="pengadaan-details">
                    <div className="pengadaan-detail-item">
                      <span className="detail-label">📅 Tanggal Order</span>
                      <span className="detail-value">
                        {formatDate(pengadaanItem.tanggalOrder)}
                      </span>
                    </div>

                    <div className="pengadaan-detail-item">
                      <span className="detail-label">🏢 Supplier</span>
                      <span className="detail-value">{pengadaanItem.supplier}</span>
                    </div>

                    <div className="pengadaan-detail-item">
                      <span className="detail-label harga"> Total Harga</span>
                      <span className="detail-value harga-value">
                        {formatCurrency(pengadaanItem.totalHarga)}
                      </span>
                    </div>

                    <div className="pengadaan-detail-item">
                      <span className="detail-label">📦 Jumlah Item</span>
                      <span className="detail-value">{pengadaanItem.barang.length} item</span>
                    </div>

                    {pengadaanItem.estimasiKedatangan && (
                      <div className="pengadaan-detail-item">
                        <span className="detail-label">🚚 Estimasi Tiba</span>
                        <span className="detail-value">
                          {formatDate(pengadaanItem.estimasiKedatangan)}
                        </span>
                      </div>
                    )}

                    {pengadaanItem.catatan && (
                      <div className="pengadaan-detail-item">
                        <span className="detail-label">📝 Catatan</span>
                        <span className="detail-value">{pengadaanItem.catatan}</span>
                      </div>
                    )}
                  </div>

                  {/* Barang List */}
                  <div className="barang-section">
                    <h4 className="barang-title">Detail Barang:</h4>
                    <div className="barang-list">
                      {pengadaanItem.barang.map((barang, barangIndex) => (
                        <div key={barangIndex} className="barang-item">
                          <div className="barang-info">
                            <span className="barang-id">🔖 {barang.barangId}</span>
                            <span className="barang-jumlah">📊 {barang.jumlah} pcs</span>
                            <span className="barang-harga">{formatCurrency(barang.hargaSatuan)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="produk-actions">
                    <button 
                    className="action-button action-edit"
                    onClick={() => handleClickEdirPengadaan(pengadaanItem._id)}>
                      Edit
                    </button>
                    <button 
                      className="action-button action-delete"
                      onClick={() => handleDelete(pengadaanItem._id)}
                    >
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