import React from 'react';
import "../Styles/Login.css";
import LoginHook from '../Hook/LoginHook';
import { useNavigate } from "react-router-dom";

export default function LoginLayout() {
    const navigate = useNavigate();
    const {loading, error, login} = LoginHook();
    
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [localError, setLocalError] = React.useState(null);
    const [showPassword, setShowPassword] = React.useState(false);
    const [rememberMe, setRememberMe] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(null);
        
        // Basic validation
        if (!email.trim()) {
            setLocalError("Email tidak boleh kosong");
            return;
        }
        
        if (!password.trim()) {
            setLocalError("Password tidak boleh kosong");
            return;
        }
        
        if (password.length < 6) {
            setLocalError("Password minimal 6 karakter");
            return;
        }

        const result = await login(email, password);
         
        if (result.success) {
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            
            alert(`Selamat datang, ${result.user?.name || "user"}!`);
            navigate("/daftar-produk");
        } else {
            setLocalError(result.message || "Email atau password salah, atau akun belum terdaftar.");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleRememberMeChange = () => {
        setRememberMe(prev => !prev);
    };
    React.useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);

    return (
        <>

            <div className="login-container">
                <div className="login-card">
                    <div className="logo-section">
                        <div className="logo"></div>
                        <h1 className="brand-title">LOGIN</h1>
                        <p className="brand-subtitle">Masuk ke akun kamu</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {/* Email Field */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="form-input"
                                placeholder="Masukkan email anda"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                autoComplete="email"
                            />
                            <span className="input-highlight"></span>
                        </div>

                        {/* Password Field */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">
                                Password
                            </label>
                            <div className="password-wrapper">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="form-input"
                                    placeholder="Masukkan password anda"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    autoComplete="current-password"
                                    minLength={6}
                                />
                                
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={togglePasswordVisibility}
                                    disabled={loading}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                >
                                    <span className="eye-icon">
                                        {showPassword ? "👁️‍🗨️" : "👁️"}
                                    </span>
                                </button>
                                
                                <span className="input-highlight"></span>
                            </div>
                        </div>

                        {/* Form Options */}
                        <div className="form-options">
                            <div className="checkbox-wrapper">
                                <div 
                                    className={`custom-checkbox ${rememberMe ? 'checked' : ''}`}
                                    onClick={handleRememberMeChange}
                                    role="checkbox"
                                    aria-checked={rememberMe}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleRememberMeChange();
                                        }
                                    }}
                                ></div>
                                <label 
                                    className="checkbox-label" 
                                    onClick={handleRememberMeChange}
                                >
                                    Ingat saya
                                </label>
                            </div>
                            
                            <a 
                                href="/reset-password" 
                                className="forgot-password"
                                tabIndex={0}
                            >
                                Lupa password?
                            </a>
                        </div>

                        {/* Error Messages */}
                        {localError && (
                            <div className="error-message" role="alert">
                                {localError}
                            </div>
                        )}
                        
                        {error && (
                            <div className="error-message" role="alert">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`login-button ${loading ? 'loading' : ''}`}
                            disabled={loading || !email.trim() || !password.trim()}
                            aria-describedby={localError || error ? "error-message" : undefined}
                        >
                            {loading ? (
                                <>
                                    <span style={{ opacity: 0 }}>Login</span>
                                </>
                            ) : (
                                "Masuk"
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="login-footer">
                        Belum punya akun?
                        <a 
                            href="/register" 
                            className="signup-link"
                            tabIndex={0}
                        >
                            Daftar sekarang
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}