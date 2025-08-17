import React from "react";
import Axios from "axios";

export default function useTambahProduk() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [successMessage, setSuccessMessage] = React.useState(null);
  const [createdProduct, setCreatedProduct] = React.useState(null);

  const tambahProduk = async (produkData) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setCreatedProduct(null);

  try {
    // Buat FormData baru //
    const formData = new FormData();

    // Append semua field ke FormData //
    formData.append("nama", produkData.nama);
    formData.append("harga", produkData.harga);
    formData.append("stok", produkData.stok);
    formData.append("kategori", produkData.kategori);
    formData.append("Deskripsi", produkData.Deskripsi);

    const response = await Axios.post(
      "http://localhost:3000/api/barang/tambah-produk",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      }
    );

    console.log("Response sukses dari server:", response);
    setSuccessMessage(response.data.message || "Produk berhasil ditambahkan");
    setCreatedProduct(response.data.data);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Terjadi kesalahan server");
      } else {
        setError("Terjadi kesalahan jaringan");
        }
      } finally {
        setLoading(false);
      }
  };

  return {
    loading,
    error,
    successMessage,
    createdProduct,
    tambahProduk,
  };
}
