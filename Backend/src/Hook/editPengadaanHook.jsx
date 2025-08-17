import React from "react";
import Axios from "axios";

export default function useEditPengadaan() {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [successMessage, setSuccessMessage] = React.useState(null);

    const editPengadaan = async (pengadaanData) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            console.log("Data yang akan dikirim ke backend:", pengadaanData);
            
            const res = await Axios.post(
                "http://localhost:3000/api/pengadaan/update-status-pengadaan",
                pengadaanData,
                 {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Response dari server:", res.data);

            setSuccessMessage(res.data.message || "Pengadaan berhasil diperbarui");
            return res.data.data;
        } catch (err) {
            console.error("Error editPengadaan:", err);
            if (err.response && err.response.data) {
                setError(err.response.data.error || "Terjadi kesalahan");
            } else {
                setError("Terjadi kesalahan jaringan");
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updatePengadaan = async (id, data) => {
        const completeData = {
            id,
            supplier: data.supplier,
            barang: data.barang,
            catatan: data.catatan,
            totalHarga: data.totalHarga,
            estimasiKedatangan: data.estimasiKedatangan
        };
        
        return await editPengadaan(completeData);
    };

    return {
        loading,
        error,
        successMessage,
        updatePengadaan,
        editPengadaan
    };
}