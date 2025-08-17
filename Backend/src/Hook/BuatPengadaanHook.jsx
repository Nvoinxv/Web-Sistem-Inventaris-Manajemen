import React from "react";
import Axios from "axios";

export default function useBuatPengadaan() {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [successMessage, setSuccessMessage] = React.useState(null);
    const [createdPengadaan, setCreatedPengadaan] = React.useState(null);

    const buatPengadaan = async (dataPengadaan) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        setCreatedPengadaan(null);

        try {
            const formData = new FormData();

            formData.append("supplier", dataPengadaan.supplier);
            formData.append("barang", JSON.stringify(dataPengadaan.barang)); 
            formData.append("totalHarga", dataPengadaan.totalHarga);
            formData.append("estimasiKedatangan", dataPengadaan.estimasiKedatangan);
            formData.append("catatan", dataPengadaan.catatan);

            const res = await Axios.post(
                  "http://localhost:3000/api/pengadaan/buat-pengadaan",
                  {
                      supplier: dataPengadaan.supplier,
                      barang: dataPengadaan.barang,
                      totalHarga: dataPengadaan.totalHarga,
                      estimasiKedatangan: dataPengadaan.estimasiKedatangan,
                      catatan: dataPengadaan.catatan
                    },
                  {
                  headers: {
                          "Content-Type": "application/json",
                        },
                      }
                    );

            console.log("Response sukses dari server:", res);
            setSuccessMessage(res.data.message || "Pengadaan Berhasil dibuat!");
            setCreatedPengadaan(res.data.data);
            
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.error || "Terjadi kesalahan server");
            } else {
                setError("Terjadi kesalahan jaringan");
            }
            console.error("Error creating pengadaan:", err);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        successMessage,
        createdPengadaan,
        buatPengadaan,
    };
}