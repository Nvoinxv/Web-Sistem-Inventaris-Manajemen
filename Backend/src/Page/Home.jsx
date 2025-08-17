import React from 'react';
import { useNavigate } from "react-router-dom";
import "../Styles/Home.css";

export default function Home() {
    const navigate = useNavigate();

    const getUserData = () => {
        try {
            const userData = localStorage.getItem("user");
            if (userData && userData !== "undefined") {
                return JSON.parse(userData);
            }
            return null;
        } catch (error) {
            console.error("Error parsing user data:", error);
            return null;
        }
    };

    const user = getUserData();
    const isLoggedIn = user !== null;
    
    const handleClickLogin = () => {
        navigate("/login");
    }
    
    const handleClickProduk = () => {
        navigate("/daftar-produk");
    }
 
    // Tambah fungsi logout //
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.reload();
    }

    React.useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    return (
        <div className="home-container">
            {/* Floating Elements */}
            <div className="floating-elements"></div>
            
            {/* Navigation */}
            <nav className="home-nav">
                <div className="nav-content">
                    <div className="nav-logo">
                        Nvoinxv Project
                    </div>
                    <ul className="nav-links">
                        <li><a href="#halaman utama" className="nav-link">Home</a></li>
                        <li><a href="#tentang" className="nav-link">About</a></li>
                        <li><a href="#kontak" className="nav-link">Contact</a></li>
                        
                        {isLoggedIn ? (
                            <li className="user-menu">
                                <span className="nav-link user-greeting">
                                    Halo, {user.nama}!
                                </span>
                                <button 
                                    onClick={handleLogout} 
                                    className="nav-link logout-btn"
                                    style={{
                                        border: 'none', 
                                        background: 'none', 
                                        cursor: 'pointer',
                                        marginLeft: '10px',
                                        color: '#ff6b6b'
                                    }}
                                >
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <li>
                                <button 
                                    onClick={handleClickLogin} 
                                    className="nav-link" 
                                    style={{border: 'none', background: 'none', cursor: 'pointer'}}
                                >
                                    Login
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
            
            {/* Main Content */}
            <main className="home-main">
                {/* Hero Section */}
                <section className="hero-section" id="halaman utama">
                    <div className="hero-icon"></div>
                    {/* Fix: Tampilkan greeting yang berbeda jika sudah login */}
                    <h1 className="hero-title">
                        {isLoggedIn 
                            ? `Selamat Datang Kembali, ${user.name}!`
                            : "Selamat Datang Di Web Manajemen Inventaris."
                        }
                    </h1>
                    <p className="hero-subtitle">
                        {isLoggedIn 
                            ? "Kelola inventaris Anda dengan mudah dan efisien."
                            : "Untuk mempermudah mengelola stok persediaan barang. Kami membuat ini agar mempermudah startup UMKM yang kecil."
                        }
                    </p>
                    <div className="hero-actions">
                       {isLoggedIn && (
                            <button onClick={handleClickProduk} className="hero-button hero-button-primary">
                                Pencarian Produk
                            </button>
                        )}
                        {!isLoggedIn && (
                            <button onClick={handleClickLogin} className="hero-button hero-button-secondary">
                                Memulai
                            </button>
                        )}
                    </div>
                </section>
                
                {/* Content Sections */}
                <div className="content-section" id="tentang">
                    {/* About Section */}
                    <div className="section-card about-section">
                        <h2 className="section-title">Tentang</h2>
                        <p className="section-description">
                           Kita memberikan solusi untuk mempermudah mengelola produk inventaris.
                           Kami membuat ini agar mempermudah startup, UMKM, dan perusahaan kecil untuk masalah manajemen ini.
                        </p>
                        
                        <div className="about-grid">
                            <div className="about-card">
                                <span className="about-card-icon">🚀</span>
                                <h3 className="about-card-title">Pengiriman Cepat</h3>
                                <p className="about-card-description">
                                    Mempercepat pengiriman transaksi barang untuk ke perusahaan lain.
                                </p>
                            </div>
                            <div className="about-card">
                                <span className="about-card-icon">💎</span>
                                <h3 className="about-card-title">Kualitas Premium</h3>
                                <p className="about-card-description">
                                    Lebih mengutamakan produk dan lebih berkualitas untuk kebutuhan perusahaan.
                                </p>
                            </div>
                            <div className="about-card">
                                <span className="about-card-icon">🤝</span>
                                <h3 className="about-card-title">Support Terbaik</h3>
                                <p className="about-card-description">
                                    24/7 support untuk mengelola produk perusahaan.
                                </p>
                            </div>
                        </div>
                        
                        <div className="about-features">
                            <div className="feature-item">
                                <div className="feature-icon">✓</div>
                                <span className="feature-text">Pembayaran Aman</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">✓</div>
                                <span className="feature-text">Menjamin uang balik</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">✓</div>
                                <span className="feature-text">Bebas biaya</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">✓</div>
                                <span className="feature-text">Pengiriman cepat</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Contact Section */}
                    <div className="section-card contact-section" id="kontak">
                        <h2 className="section-title">Menghubungi</h2>
                        <div className="contact-content">
                            <div className="contact-info">
                                <div className="contact-item">
                                    <div className="contact-item-icon">📧</div>
                                    <div className="contact-item-content">
                                        <div className="contact-item-title">Email</div>
                                        <div className="contact-item-text">edwardfarrel79@gmail.com</div>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <div className="contact-item-icon">📞</div>
                                    <div className="contact-item-content">
                                        <div className="contact-item-title">Nomer Telepon</div>
                                        <div className="contact-item-text">+62-878-4075-1695</div>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <div className="contact-item-icon">📍</div>
                                    <div className="contact-item-content">
                                        <div className="contact-item-title">Alamat</div>
                                        <div className="contact-item-text">123 Business St, City, State 12345</div>
                                    </div>
                                </div>
                            </div>
                            
                            <form className="contact-form">
                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input type="text" className="form-input" placeholder="Nama kamu" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-input" placeholder="Email kamu" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Pesan</label>
                                    <textarea className="form-textarea" placeholder="Pesan kamu" rows="5"></textarea>
                                </div>
                                <button type="submit" className="contact-button">Kirim pesan</button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            
            {/* Footer */}
            <footer className="home-footer">
                <div className="footer-content">
                    <p className="footer-text">© 2026 Nvoin Company. All rights reserved.</p>
                    <ul className="footer-links">
                        <li><a href="#privacy" className="footer-link">Privacy Policy</a></li>
                        <li><a href="#terms" className="footer-link">Terms of Service</a></li>
                        <li><a href="#support" className="footer-link">Support</a></li>
                    </ul>
                </div>
            </footer>
        </div>
    );
}