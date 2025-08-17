import React from 'react';
import Axios from 'axios';

export default function RegisterHook() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [message, setMessage] = React.useState(null);

  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // POST request kirim data ke backend //
      const response = await Axios.post("http://localhost:3000/api/auth/register", {
        username,
        email,
        password,
      });

      // Jika berhasil, response biasanya status 201 dan message sukses //
      setMessage(response.data.message || "Register berhasil!");
    } catch (err) {
      if (err.response && err.response.data) {
        // Bisa error validasi atau user sudah ada //
        setError(err.response.data.message || JSON.stringify(err.response.data.error) || "Terjadi kesalahan");
      } else {
        setError("Terjadi kesalahan jaringan atau server");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    message,
    register,
  };
}
