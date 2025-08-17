import React from "react";
import useBuatPengadaan from "../Hook/BuatPengadaanHook";
import "../Styles/buatPengadaan.css";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function FormPengadaan() {
  const { buatPengadaan, loading, error, successMessage } = useBuatPengadaan();

  const [formData, setFormData] = React.useState({
    supplier: "",
    barang: [{ barangId: "", jumlah: "", hargaSatuan: "" }],
    estimasiKedatangan: "",
    catatan: ""
  });

  const navigate = useNavigate();
  
  const [daftarBarang, setDaftarBarang] = React.useState([]);
  const [filteredBarang, setFilteredBarang] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = React.useState([]);

  React.useEffect(() => {
    const fetchBarang = async () => {
      try {
        const res = await Axios.post("http://localhost:3000/api/barang/daftar-produk");
        setDaftarBarang(res.data);
      } catch (err) {
        console.error("Gagal load daftar barang", err);
        setDaftarBarang([]);
      }
    };

    fetchBarang();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleBarangChange = (index, e) => {
    const { name, value } = e.target;
    const newBarang = [...formData.barang];
    
    if (name === "jumlah" || name === "hargaSatuan") {
      newBarang[index] = {
        ...newBarang[index],
        [name]: value === "" ? "" : Number(value)
      };
    } else {
      newBarang[index] = {
        ...newBarang[index],
        [name]: value
      };
    }
    
    setFormData(prevData => ({ ...prevData, barang: newBarang }));
  };

  const handleSearchBarang = (e, index) => {
    const value = e.target.value;
    const newBarang = [...formData.barang];
    newBarang[index].barangId = value; 

    setFormData(prevData => ({ ...prevData, barang: newBarang }));
    const newShowSuggestions = [...showSuggestions];
    
    if (value.length > 1 && Array.isArray(daftarBarang)) {
      const results = daftarBarang.filter(b =>
        (b.nama || "").toLowerCase().includes(value.toLowerCase()) ||
        b.id?.toString().includes(value)
      );
        setFilteredBarang(results);
        newShowSuggestions[index] = true;
      } else {
        setFilteredBarang([]);
        newShowSuggestions[index] = false;
    }
    
    setShowSuggestions(newShowSuggestions);
  };

  const selectBarang = (barang, index) => {
    const newBarang = [...formData.barang];
    newBarang[index].barangId = barang.id;
    setFormData(prevData => ({ ...prevData, barang: newBarang }));
  
    const newShowSuggestions = [...showSuggestions];
    newShowSuggestions[index] = false;
    setShowSuggestions(newShowSuggestions);
    setFilteredBarang([]);
  };

  const addBarangItem = () => {
    setFormData(prevData => ({
      ...prevData,
      barang: [...prevData.barang, { barangId: "", jumlah: "", hargaSatuan: "" }]
    }));
  };

  const removeBarangItem = (index) => {
    if (formData.barang.length > 1) {
      const newBarang = formData.barang.filter((_, i) => i !== index);
      setFormData(prevData => ({ ...prevData, barang: newBarang }));
    }
  };

  const handleClick = () => {
    navigate("/lihat-pengadaan");
  }

  const calculateTotalHarga = () => {
    return formData.barang.reduce((total, item) => {
      const jumlah = Number(item.jumlah) || 0;
      const hargaSatuan = Number(item.hargaSatuan) || 0;
      return total + (jumlah * hargaSatuan);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        totalHarga: calculateTotalHarga()
      };
      await buatPengadaan(dataToSubmit);
      
      if (successMessage) {
        setFormData({
          supplier: "",
          barang: [{ barangId: "", jumlah: "", hargaSatuan: "" }],
          estimasiKedatangan: "",
          catatan: ""
        });
        setFilteredBarang([]);
        setShowSuggestions([]);
        handleClick();
      }
    } catch (err) {
      console.error("Gagal membuat pengadaan", err);
    }
  };

  return (
    <div className="tambah-produk-container">
      <div className="grid-pattern"></div>

      <div className="pengadaan-tambah-header">
        <div className="pengadaan-tambah-icon"></div>
        <h1 className="pengadaan-tambah-title">Buat Pengadaan</h1>
        <p className="pengadaan-tambah-subtitle">
          Masukkan data pengadaan untuk supplier
        </p>
      </div>

      <div className="pengadaan-tambah-form-container">
        {successMessage && <div className="success-message">{successMessage}</div>}
        {error && <div className="error-message">{error}</div>}

        <form className="pengadaan-tambah-form" onSubmit={handleSubmit}>
          {/* Supplier */}
          <div className="form-group">
            <label className="form-label">Nama Supplier</label>
            <input
              type="text"
              name="supplier"
              className="form-input"
              placeholder="Nama Supplier"
              value={formData.supplier}
              onChange={handleChange}
              required
            />
            <span className="input-highlight"></span>
          </div>

          {/* Barang List */}
          <div className="form-group">
            <label className="form-label">Daftar Barang</label>
            <div className="barang-list">
              {formData.barang.map((item, index) => (
                <div key={index} className="barang-item">
                  <div className="barang-search-container">
                    <input
                      type="text"
                      name="barangId"
                      className="form-input"
                      placeholder="Cari ID atau Nama Barang"
                      value={item.barangId}
                      onChange={e => handleSearchBarang(e, index)}
                      onFocus={() => {
                        const newShow = [...showSuggestions];
                        newShow[index] = true;
                        setShowSuggestions(newShow);
                      }}
                      required
                    />
                    
                    {/* Suggestions dropdown */}
                    {showSuggestions[index] && filteredBarang.length > 0 && (
                      <div className="suggestions-dropdown">
                        {filteredBarang.map(barang => (
                          <div
                            key={barang.id}
                            className="suggestion-item"
                            onClick={() => selectBarang(barang, index)}
                          >
                            {barang.id} - {barang.nama}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <input
                    type="number"
                    name="jumlah"
                    className="form-input"
                    placeholder="Jumlah"
                    value={item.jumlah}
                    onChange={e => handleBarangChange(index, e)}
                    min="1"
                    required
                  />

                  <input
                    type="number"
                    name="hargaSatuan"
                    className="form-input"
                    placeholder="Harga Satuan"
                    value={item.hargaSatuan}
                    onChange={e => handleBarangChange(index, e)}
                    min="0"
                    required
                  />

                  <div className="barang-item-actions">
                    {formData.barang.length > 1 && (
                      <button
                        type="button"
                        className="remove-item-button"
                        onClick={() => removeBarangItem(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <div className="subtotal">
                    Subtotal: Rp {((Number(item.jumlah) || 0) * (Number(item.hargaSatuan) || 0)).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                className="add-item-button"
                onClick={addBarangItem}
                >
                Tambah Barang
              </button>
            </div>
          </div>

          {/* Total Harga */}
          <div className="form-group">
            <div className="total-harga">
              <strong>Total Harga: Rp {calculateTotalHarga().toLocaleString('id-ID')}</strong>
            </div>
          </div>

          {/* Estimasi Kedatangan */}
          <div className="form-group">
            <label className="form-label">Estimasi Kedatangan</label>
            <input
              type="date"
              name="estimasiKedatangan"
              className="form-input"
              value={formData.estimasiKedatangan}
              onChange={handleChange}
              required
            />
            <span className="input-highlight"></span>
          </div>

          {/* Catatan */}
          <div className="form-group">
            <label className="form-label">Catatan</label>
            <textarea
              name="catatan"
              className="form-textarea"
              placeholder="Tambahkan catatan..."
              value={formData.catatan}
              onChange={handleChange}
              rows="4"
            />
            <span className="input-highlight"></span>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className={`submit-button ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Buat Pengadaan"}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => {
                setFormData({
                  supplier: "",
                  barang: [{ barangId: "", jumlah: "", hargaSatuan: "" }],
                  estimasiKedatangan: "",
                  catatan: ""
                });
                setFilteredBarang([]);
                setShowSuggestions([]);
                handleClick();
              }}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}