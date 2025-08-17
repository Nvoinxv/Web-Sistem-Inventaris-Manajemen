import React from "react";
import Axios from "axios";

export default function useDaftarProduk() {
  const [produk, setProduk] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const fetchProduk = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await Axios.post("http://localhost:3000/api/barang/daftar-produk");
      console.log("Data dari API:", response.data.data); 
      setProduk(response.data.data); // backend kirim produk di data //
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

  React.useEffect(() => {
    fetchProduk();
  }, []);

  return {
    produk,
    loading,
    error,
    fetchProduk, 
  };
}
