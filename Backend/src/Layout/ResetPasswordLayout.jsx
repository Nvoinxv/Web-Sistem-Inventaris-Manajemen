import ResetPasswordHook from "../Hook/ResetPasswordHook";
import React from "react";
import "../Styles/reset_password.css";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const {loading, error, success, resetPassword } = ResetPasswordHook();
    const [newpassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfrimPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [email, setEmail] = React.useState("")
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [passwordStrength, setPasswordStrength] = React.useState("");
    const Navigate = useNavigate();

    const handleLogin = () => {
        Navigate("/login");
    }

    const checkPasswordStrength = (password) => {
        if (!password) return "";
        if (password.length < 6) return "weak";
        if (password.length >= 6 && password.length < 10) return "medium";
        if (password.length >= 10) return "strong";
    };
    
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);
        setPasswordStrength(checkPasswordStrength(value));
    };

    const HandleSubmit = async (e) => {
        e.preventDefault();

        await resetPassword({
            newPassword: newpassword,
            confirmPassword,
            email
        });
    };

    React.useEffect(() => {
    if (success) {
        console.log("Reset password berhasil!");
        setTimeout(() => {
            handleLogin();
            }, 500);
        }
    }, [success]);

    React.useEffect(() => {
        const container = document.querySelector(".reset-container");
        if (container) {
            container.classList.add("loaded");
        }
    }, []);

    return (
        <>
            {/* Particles Background */}
            <div className="particles">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
            </div>

            <div className="reset-container">
                <div className="reset-card">
                    <div className="logo-section">
                        <div className="logo"></div>
                        <h1 className="brand-title">
                            Reset Password
                        </h1>
                        <p className="brand-subtitle">
                            Reset password kamu untuk melanjutkan ke halaman login.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="success-message">
                            {success}
                        </div>
                    )}

                    <form className="reset-form" onSubmit={HandleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input 
                                type="email"
                                className="form-input"
                                placeholder="Masukan Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                        </div>
                        {/* New Password Field */}
                        <div className="form-group">
                            <label className="form-label">Password Baru</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-input"
                                    placeholder="Masukkan password baru"
                                    value={newpassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                            
                            {/* Password Strength Indicator */}
                            {newpassword && (
                                <>
                                    <div className="password-strength">
                                        <div className={`strength-bar strength-${passwordStrength}`}></div>
                                    </div>
                                    <div className={`strength-text ${passwordStrength}`}>
                                        Password: {passwordStrength === "weak" ? "Lemah" : 
                                                 passwordStrength === "medium" ? "Sedang" : "Kuat"}
                                    </div>
                                </>
                            )}

                            {/* Password Requirements */}
                            <div className="password-requirements">
                                <div className="requirements-title">Syarat Password:</div>
                                <div className={`requirement-item ${newpassword && newpassword.length >= 6 ? 'valid' : ''}`}>
                                    Minimal 6 karakter
                                </div>
                                <div className={`requirement-item ${newpassword && /[A-Z]/.test(newpassword) ? 'valid' : ''}`}>
                                    Mengandung huruf besar
                                </div>
                                <div className={`requirement-item ${newpassword && /[0-9]/.test(newpassword) ? 'valid' : ''}`}>
                                    Mengandung angka
                                </div>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="form-group">
                            <label className="form-label">Konfirmasi Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="form-input"
                                    placeholder="Konfirmasi password baru"
                                    value={confirmPassword}
                                    onChange={(e) => setConfrimPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? "🙈" : "👁️"}
                                </button>
                            </div>

                            {/* Password Match Indicator */}
                            {confirmPassword && newpassword && (
                                <div className={`strength-text ${newpassword === confirmPassword ? 'strong' : 'weak'}`}>
                                    {newpassword === confirmPassword ? 
                                        "✓ Password cocok" : 
                                        "✗ Password tidak cocok"
                                    }
                                </div>
                            )}
                        </div>

                        {/* Reset Button */}
                        <button 
                            type="submit" 
                            className={`reset-button ${loading ? 'loading' : ''}`}
                            disabled={loading || !newpassword || !confirmPassword || newpassword !== confirmPassword}
                        >
                            {loading ? '' : 'Reset Password'}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className="back-to-login">
                        <button type="button" className="back-link" onClick={handleLogin}>
                            Kembali ke Login
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}