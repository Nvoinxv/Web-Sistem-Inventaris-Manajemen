import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginLayout from '../src/Layout/LoginLayout';
import RegisterLayout from './Layout/RegisterLayout';
import DaftarProdukLayout from './Layout/daftarProdukLayout';
import TambahProduk from './Layout/tambah_produkLayout';
import BuatPengadaan from './Layout/BuatPengadaanLayout';
import LihatPengadaan from "./Layout/LihatPengadaanLayout";
import EditProduk from "./Layout/editProdukLayout"; 
import ResetPassword from "./Layout/ResetPasswordLayout";
import EditPengadaanLayout from "./Layout/editPengadaanLayout";
import Home from "./Page/Home";
import PrivateRoute from './Routes/PrivateRoute';

const MainAPP = () => {
    return (
        <Router>
            <Routes>
                {/* Semua route tetap sama */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginLayout />} />
                <Route path="/register" element={<RegisterLayout />} />
                <Route path="/reset-password" element={<ResetPassword/>} />

                {/* Bagian Produk (wrap dengan PrivateRoute) */}
                <Route path="/daftar-produk" element={
                    <PrivateRoute><DaftarProdukLayout /></PrivateRoute>
                } />
                <Route path="/tambah-produk" element={
                    <PrivateRoute><TambahProduk /></PrivateRoute>
                } />
                <Route path="/edit-produk/:id" element={
                    <PrivateRoute><EditProduk /></PrivateRoute>
                } />

                {/* Bagian Pengadaan (wrap dengan PrivateRoute) */}
                <Route path="/buat-pengadaan" element={
                    <PrivateRoute><BuatPengadaan /></PrivateRoute>
                } />
                <Route path="/lihat-pengadaan" element={
                    <PrivateRoute><LihatPengadaan /></PrivateRoute>
                } />
                <Route path="/edit-status-pengadaan/:id" element={
                    <PrivateRoute><EditPengadaanLayout/></PrivateRoute>
                } />
            </Routes>
        </Router>
    )
}

export default MainAPP;
