import React from "react";
import useEditPengadaan from "../Hook/editPengadaanHook";
import "../Styles/buatPengadaan.css";
import Axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

export default function EditPengadaan() {
    const {loading, error, successMessage, updatePengadaan, editPengadaan} = useEditPengadaan();
    const [formData, setFormData] = React.useState({
        supplier: "",
        barang: [{ barangId: "", jumlah: "", hargaSatuan: "" }],
        estimasiKedatangan: "",
        catatan: ""
    });
    const navigate = useNavigate();
    const { id } = useParams();

    const [daftarBarang, setDaftarBarang] = React.useState([]);
    const [filteredBarang, setFilteredBarang] = React.useState([]);
    const [showSuggestions, setShowSuggestions] = React.useState([]);
    
    // Fix: Tambah fetch daftar barang
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
    
    React.useEffect(() => {
        const fetchEditBarang = async () => {
            try {
                const res = await Axios.get(`http://localhost:3000/api/pengadaan/lihat-pengadaan/${id}`);
                
                // Fix: Format tanggal dengan benar
                const estimasiFormatted = res.data.estimasiKedatangan 
                    ? new Date(res.data.estimasiKedatangan).toISOString().split("T")[0]
                    : "";
                
                setFormData({
                    ...res.data,
                    estimasiKedatangan: estimasiFormatted,
                    // Fix: Pastikan totalHarga ada
                    totalHarga: res.data.totalHarga || 0
                });
                console.log("Data:produk:", res.data);
            } catch (err) {
                console.error("Gagal ambil data pengadaan", err);
            }
        };
        fetchEditBarang();
    }, [id]);

    const handleClick = () => {
        navigate("/lihat-pengadaan");
    }

    // Fix: Perbaiki handleCancel
    const handleCancel = () => {
        handleClick();
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
        ...prevData,
        [name]: value
        }));
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

  const newTotal = newBarang.reduce((total, item) => {
      const jumlah = Number(item.jumlah) || 0;
      const hargaSatuan = Number(item.hargaSatuan) || 0;
      return total + (jumlah * hargaSatuan);
    }, 0);

      setFormData(prevData => ({ ...prevData, barang: newBarang, totalHarga: newTotal }));
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

    // Fix: Hapus fungsi formatForInputDate yang tidak digunakan
    const removeBarangItem = (index) => {
    if (formData.barang.length > 1) {
        const newBarang = formData.barang.filter((_, i) => i !== index);
        const newTotal = newBarang.reduce((total, item) => {
            const jumlah = Number(item.jumlah) || 0;
            const hargaSatuan = Number(item.hargaSatuan) || 0;
            return total + (jumlah * hargaSatuan);
        }, 0);

            setFormData(prevData => ({ ...prevData, barang: newBarang, totalHarga: newTotal }));
        }
    };

    const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const totalHarga = formData.barang.reduce((total, item) => {
      const jumlah = Number(item.jumlah) || 0;
      const hargaSatuan = Number(item.hargaSatuan) || 0;
      return total + (jumlah * hargaSatuan);
    }, 0);
    
    // Fix: Handle date dengan lebih sederhana
    const dataToSubmit = {
      ...formData,
      estimasiKedatangan: formData.estimasiKedatangan, // Langsung kirim format YYYY-MM-DD
      totalHarga
    };
    
    console.log("Data yang dikirim:", dataToSubmit);
    await updatePengadaan(id, dataToSubmit);

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
     <div className="pengadaan-tambah-container">
      <div className="grid-pattern"></div>

      <div className="pengadaan-tambah-header">
        <div className="pengadaan-tambah-icon"></div>
        {/* Fix: Ubah title menjadi Edit */}
        <h1 className="pengadaan-tambah-title">Edit Pengadaan</h1>
        <p className="pengadaan-tambah-subtitle">
          Ubah data pengadaan untuk supplier
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
                  <div className="barang-item-grid">
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
              <strong>Total Harga: Rp {(formData.totalHarga || 0).toLocaleString('id-ID')}</strong>
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
              {/* Fix: Ubah text menjadi Update */}
              {loading ? "Mengupdate..." : "Update Pengadaan"}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
    );
}