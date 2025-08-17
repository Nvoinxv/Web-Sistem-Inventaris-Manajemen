import React from "react";
import Axios from "axios";

export default function useKurangiStok() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [successMessage, setSuccessMessage] = React.useState(null);
  const [updatedProduct, setUpdatedProduct] = React.useState(null);

  const kurangiStok = async (id, jumlah) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setUpdatedProduct(null);

    if (!id || typeof jumlah !== "number") {
      setError("ID dan jumlah harus diisi dengan benar");
      setLoading(false);
      return;
    }

    try {
      const response = await Axios.post("http://localhost:3000/api/barang/hapus-produk", {
        id,
        jumlah,
      });

      setSuccessMessage(response.data.message || "Stok berhasil dikurangi");
      setUpdatedProduct(response.data.data);
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
    updatedProduct,
    kurangiStok,
  };
}
