import React from "react";
import Axios from "axios";

export default function useLihatPengadaan() {
  const [pengadaan, setPengadaan] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  
  const fetchPengadaan = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await Axios.post("http://localhost:3000/api/pengadaan/lihat-pengadaan");
      setPengadaan(res.data);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Terjadi kesalahan server");
      } else {
        setError("Terjadi kesalahan jaringan");
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPengadaan();
  }, []);

  return {
    pengadaan,
    loading,
    error,
    fetchPengadaan,
    setPengadaan
  };
}
