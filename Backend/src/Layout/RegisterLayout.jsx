import React from 'react';
import RegisterHook from '../Hook/RegisterHook';
import { useNavigate } from "react-router-dom";
import '../Styles/Register.css';

export default function RegisterLayout() {
  const { loading, error, register, message } = RegisterHook();

  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordStrength, setPasswordStrength] = React.useState("");
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const Navigate = useNavigate();

  const handleLogin = () => {
    Navigate("/login");
  }

  const checkPasswordStrength = (password) => {
    if (!password) return "";
    if (password.length < 6) return "weak";
    if (password.length >= 6 && password.length < 8) return "fair";
    if (password.length >= 8 && password.length < 12) return "good";
    if (password.length >= 12) return "strong";
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordStrength(checkPasswordStrength(value));
  };

  const getStrengthText = (strength) => {
    switch(strength) {
      case "weak": return "Lemah";
      case "fair": return "Cukup";
      case "good": return "Bagus";
      case "strong": return "Kuat";
      default: return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await register(username, email, password);

    if (result.success) {
      console.log("Register berhasil!");
      setTimeout(() => {
        handleLogin();
      }, 500);
    }
  };

  return (
    <>
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <div className="register-icon"></div>
            <h1 className="register-title">Register</h1>
            <p className="register-subtitle">Daftar Buat Akun Baru</p>
          </div>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            {/* Username Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                className="form-input"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field with Strength Indicator */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Masukkan password"
                  value={password}
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
              {password && (
                <>
                  <div className="password-strength">
                    <div className={`strength-bar strength-${passwordStrength}`}></div>
                  </div>
                  <div className={`strength-text strength-${passwordStrength}-text`}>
                    Kekuatan Password: {getStrengthText(passwordStrength)}
                  </div>
                </>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="terms-wrapper">
              <div 
                className={`custom-checkbox ${termsAccepted ? 'checked' : ''}`}
                onClick={() => setTermsAccepted(!termsAccepted)}
              ></div>
              <div className="terms-text" onClick={() => setTermsAccepted(!termsAccepted)}>
                Saya setuju dengan{' '}
                <a href="#" className="terms-link" onClick={(e) => e.stopPropagation()}>
                  Syarat dan Ketentuan
                </a>
                {' '}dan{' '}
                <a href="#" className="terms-link" onClick={(e) => e.stopPropagation()}>
                  Kebijakan Privasi
                </a>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className={`register-button ${loading ? "loading" : ""}`}
              disabled={loading || !termsAccepted || !username || !email || !password}
            >
              {loading ? "" : "Daftar"}
            </button>
          </form>
          {/* Footer */}
          <div className="register-footer">
            Sudah punya akun?
            <button type="button" className="login-link" onClick={handleLogin}>
              Masuk di sini
            </button>
          </div>
        </div>
      </div>
    </>
  );
}